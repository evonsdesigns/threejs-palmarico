import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { SkySunController } from './SkySunController';

export class WaterScene {
    private container: HTMLElement;
    private stats: Stats;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private water: any;
    private clock: THREE.Clock;
    private delta: number;
    private boxes: THREE.Mesh[];
    private numBoxes: number;

    private skySun: SkySunController;

    private waves = {
        A: { direction: 0, steepness: 0, wavelength: 60 },
        B: { direction: 30, steepness: 0, wavelength: 30 },
        C: { direction: 60, steepness: 0, wavelength: 15 },
    };

    constructor(containerId: string = 'container', camera, renderer, controls, scene, skySun: SkySunController) {
        this.container = document.getElementById(containerId)!;
        this.stats = new Stats();
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.boxes = [];
        this.numBoxes = 10;

        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.skySun = skySun;
    }

    private getWaveInfo(x: number, z: number, time: number) {
        const pos = new THREE.Vector3();
        const tangent = new THREE.Vector3(1, 0, 0);
        const binormal = new THREE.Vector3(0, 0, 1);
        Object.keys(this.waves).forEach((wave) => {
            const w = this.waves[wave];
            const k = (Math.PI * 2) / w.wavelength;
            const c = Math.sqrt(9.8 / k);
            const d = new THREE.Vector2(
                Math.sin((w.direction * Math.PI) / 180),
                -Math.cos((w.direction * Math.PI) / 180)
            );
            const f = k * (d.dot(new THREE.Vector2(x, z)) - c * time);
            const a = w.steepness / k;

            pos.x += d.y * (a * Math.cos(f));
            pos.y += a * Math.sin(f);
            pos.z += d.x * (a * Math.cos(f));

            tangent.x += -d.x * d.x * (w.steepness * Math.sin(f));
            tangent.y += d.x * (w.steepness * Math.cos(f));
            tangent.z += -d.x * d.y * (w.steepness * Math.sin(f));

            binormal.x += -d.x * d.y * (w.steepness * Math.sin(f));
            binormal.y += d.y * (w.steepness * Math.cos(f));
            binormal.z += -d.y * d.y * (w.steepness * Math.sin(f));
        });

        const normal = binormal.cross(tangent).normalize();

        return { position: pos, normal: normal };
    }

    private updateBoxes(delta: number) {
        const t = this.water.material.uniforms['time'].value;
        this.boxes.forEach((b) => {
            const waveInfo = this.getWaveInfo(b.position.x, b.position.z, t);
            b.position.y = waveInfo.position.y;
            const quat = new THREE.Quaternion().setFromEuler(
                new THREE.Euler(waveInfo.normal.x, waveInfo.normal.y, waveInfo.normal.z)
            );
            b.quaternion.rotateTowards(quat, delta * 0.5);
        });
    }

    public init() {
        const waterGeometry = new THREE.PlaneGeometry(512, 512, 64, 64);
        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                'textures/waternormals.jpg',
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined,
        });
        this.water.rotation.x = -Math.PI / 2;

        this.water.material.onBeforeCompile = (shader) => {
            shader.uniforms.waveA = {
                value: [
                    Math.sin((this.waves.A.direction * Math.PI) / 180),
                    Math.cos((this.waves.A.direction * Math.PI) / 180),
                    this.waves.A.steepness,
                    this.waves.A.wavelength,
                ],
            };
            shader.uniforms.waveB = {
                value: [
                    Math.sin((this.waves.B.direction * Math.PI) / 180),
                    Math.cos((this.waves.B.direction * Math.PI) / 180),
                    this.waves.B.steepness,
                    this.waves.B.wavelength,
                ],
            };
            shader.uniforms.waveC = {
                value: [
                    Math.sin((this.waves.C.direction * Math.PI) / 180),
                    Math.cos((this.waves.C.direction * Math.PI) / 180),
                    this.waves.C.steepness,
                    this.waves.C.wavelength,
                ],
            };
            shader.vertexShader = (document.getElementById('vertexShader') as HTMLScriptElement).textContent!;
            shader.fragmentShader = (document.getElementById('fragmentShader') as HTMLScriptElement).textContent!;
        };

        this.scene.add(this.water);

        // Sky
        const skyUniforms = this.skySun.sky.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        const parameters = {
            elevation: 2,
            azimuth: 180,
        };
        const updateWaterSun = () => {
            this.water.material.uniforms['sunDirection'].value.copy(this.skySun.getSunDirection());
        };

        updateWaterSun();

        // Stats
        this.container.appendChild(this.stats.dom);

        // GUI
        const gui = new GUI();
        const waterUniforms = this.water.material.uniforms;

        const folderWater = gui.addFolder('Water');
        folderWater
            .add(waterUniforms.distortionScale, 'value', 0, 8, 0.1)
            .name('distortionScale');
        folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
        folderWater.add(this.water.material, 'wireframe');
        folderWater.open();

        const waveAFolder = gui.addFolder('Wave A');
        waveAFolder
            .add(this.waves.A, 'direction', 0, 359)
            .name('Direction')
            .onChange((v: number) => {
                const x = (v * Math.PI) / 180;
                this.water.material.uniforms.waveA.value[0] = Math.sin(x);
                this.water.material.uniforms.waveA.value[1] = Math.cos(x);
            });
        waveAFolder
            .add(this.waves.A, 'steepness', 0, 1, 0.1)
            .name('Steepness')
            .onChange((v: number) => {
                this.water.material.uniforms.waveA.value[2] = v;
            });
        waveAFolder
            .add(this.waves.A, 'wavelength', 1, 100)
            .name('Wavelength')
            .onChange((v: number) => {
                this.water.material.uniforms.waveA.value[3] = v;
            });
        waveAFolder.open();

        const waveBFolder = gui.addFolder('Wave B');
        waveBFolder
            .add(this.waves.B, 'direction', 0, 359)
            .name('Direction')
            .onChange((v: number) => {
                const x = (v * Math.PI) / 180;
                this.water.material.uniforms.waveB.value[0] = Math.sin(x);
                this.water.material.uniforms.waveB.value[1] = Math.cos(x);
            });
        waveBFolder
            .add(this.waves.B, 'steepness', 0, 1, 0.1)
            .name('Steepness')
            .onChange((v: number) => {
                this.water.material.uniforms.waveB.value[2] = v;
            });
        waveBFolder
            .add(this.waves.B, 'wavelength', 1, 100)
            .name('Wavelength')
            .onChange((v: number) => {
                this.water.material.uniforms.waveB.value[3] = v;
            });
        waveBFolder.open();

        const waveCFolder = gui.addFolder('Wave C');
        waveCFolder
            .add(this.waves.C, 'direction', 0, 359)
            .name('Direction')
            .onChange((v: number) => {
                const x = (v * Math.PI) / 180;
                this.water.material.uniforms.waveC.value[0] = Math.sin(x);
                this.water.material.uniforms.waveC.value[1] = Math.cos(x);
            });
        waveCFolder
            .add(this.waves.C, 'steepness', 0, 1, 0.1)
            .name('Steepness')
            .onChange((v: number) => {
                this.water.material.uniforms.waveC.value[2] = v;
            });
        waveCFolder
            .add(this.waves.C, 'wavelength', 1, 100)
            .name('Wavelength')
            .onChange((v: number) => {
                this.water.material.uniforms.waveC.value[3] = v;
            });
        waveCFolder.open();

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public animate = () => {
        requestAnimationFrame(this.animate);
        this.delta = this.clock.getDelta();
        this.water.material.uniforms['time'].value += this.delta;
        this.updateBoxes(this.delta);
        this.render();
        this.stats.update();
    };

    private render() {
        this.renderer.render(this.scene, this.camera);
    }
}