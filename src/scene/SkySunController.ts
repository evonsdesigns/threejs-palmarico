import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class SkySunController {
    public sky: Sky;
    public sun: THREE.Vector3;
    public uniforms: any;
    public sunlight: THREE.DirectionalLight;
    private scene: THREE.Scene;
    private parameters = { elevation: 2, azimuth: 180 };

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.sky = new Sky();
        this.sky.scale.setScalar(10000);
        this.scene.add(this.sky);

        this.sun = new THREE.Vector3();
        this.uniforms = this.sky.material.uniforms;
        this.uniforms['turbidity'].value = 10;
        this.uniforms['rayleigh'].value = 2;
        this.uniforms['mieCoefficient'].value = 0.005;
        this.uniforms['mieDirectionalG'].value = 0.8;

        this.sunlight = new THREE.DirectionalLight(0xffffff, 1.2);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.mapSize.set(2048, 2048);
        this.sunlight.shadow.camera.left = -120;
        this.sunlight.shadow.camera.right = 120;
        this.sunlight.shadow.camera.top = 120;
        this.sunlight.shadow.camera.bottom = -120;
        this.sunlight.shadow.camera.near = 1;
        this.sunlight.shadow.camera.far = 2000;
        this.sunlight.shadow.bias = -0.0001;
        this.sunlight.shadow.normalBias = 0.04;
        this.scene.add(this.sunlight);
        this.scene.add(this.sunlight.target);
        this.updateSun();
    }

    public setParameters(elevation: number, azimuth: number) {
        this.parameters.elevation = elevation;
        this.parameters.azimuth = azimuth;
        this.updateSun();
    }

    public updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
        const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);

        this.sun.setFromSphericalCoords(1, phi, theta);
        this.uniforms['sunPosition'].value.copy(this.sun);
        this.setTarget(this.sunlight.target.position);
    }

    public setTarget(target: THREE.Vector3) {
        this.sunlight.target.position.copy(target);
        this.sunlight.position.copy(target).addScaledVector(this.sun, 900);
        this.sunlight.target.updateMatrixWorld();
    }

    public setShadowExtent(extent: number) {
        const camera = this.sunlight.shadow.camera;
        if (camera.right === extent) return;
        camera.left = camera.bottom = -extent;
        camera.right = camera.top = extent;
        camera.updateProjectionMatrix();
    }

    public updateFade(elevation: number): void {
        const fadeStart = 5;   // Elevation where fading starts
        const fadeEnd = 15;    // Elevation where sun is fully visible
        let fade = (elevation - fadeStart) / (fadeEnd - fadeStart);
        fade = Math.max(0, Math.min(1, fade)); // Clamp between 0 and 1

        // Fade sunlight intensity
        this.sunlight.intensity = 0.6 * fade;
        // Fade sky parameters for night
        if (fade === 0) {
            this.uniforms.turbidity.value = 2;
            this.uniforms.rayleigh.value = 0.2;
            this.uniforms.mieCoefficient.value = 0.001;
            this.uniforms.mieDirectionalG.value = 0.1;
        } else {
            this.uniforms.turbidity.value = 10;
            this.uniforms.rayleigh.value = 2;
            this.uniforms.mieCoefficient.value = 0.005;
            this.uniforms.mieDirectionalG.value = 0.8;
        }
    }
}