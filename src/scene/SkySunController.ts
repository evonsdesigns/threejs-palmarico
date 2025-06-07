import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class SkySunController {
    public sky: Sky;
    public sun: THREE.Vector3;
    public uniforms: any;
    public sunlight: THREE.DirectionalLight; // <-- Add this
    private pmremGenerator: THREE.PMREMGenerator;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private parameters = { elevation: 2, azimuth: 180 };
    public sunMesh: THREE.Mesh; // <-- Add this property to your class

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.sky = new Sky();
        this.sky.scale.setScalar(10000);
        this.scene.add(this.sky);

        this.sun = new THREE.Vector3();
        this.uniforms = this.sky.material.uniforms;
        this.uniforms['turbidity'].value = 10;
        this.uniforms['rayleigh'].value = 2;
        this.uniforms['mieCoefficient'].value = 0.005;
        this.uniforms['mieDirectionalG'].value = 0.8;

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);

        // Add sunlight
        this.sunlight = new THREE.DirectionalLight(0xffffff, 1.2);
        this.sunlight.position.copy(this.sun.clone().multiplyScalar(1000));
     
        this.scene.add(this.sunlight);

        // Add this code to create the sun mesh
        const sunGeometry = new THREE.SphereGeometry(20, 32, 32); // Adjust size as needed
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffee, 
            emissive: 0xffffee, 
            transparent: true, // Enable transparency
            opacity: 1 
        });
        this.sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sunMesh.layers.set(0); // Make sure it's rendered in the main layer
        this.scene.add(this.sunMesh);

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
        this.scene.environment = this.pmremGenerator.fromScene(this.sky).texture;

        // Update sunlight position and direction
        this.sunlight.position.copy(this.sun.clone().multiplyScalar(1000));
        this.sunlight.target.position.set(0, 0, 0);
        this.sunlight.target.updateMatrixWorld();

        this.sky.material.uniforms['sunPosition'].value.copy(this.sun);

        // Update the sun mesh position
        const sunDistance = 4000; // Place the sun far away
        this.sunMesh.position.copy(this.sun.clone().multiplyScalar(sunDistance));
    }

    public getSunDirection() {
        return this.sun.clone().normalize();
    }

    public updateFade(elevation: number): void {
        const fadeStart = 5;   // Elevation where fading starts
        const fadeEnd = 15;    // Elevation where sun is fully visible
        let fade = (elevation - fadeStart) / (fadeEnd - fadeStart);
        fade = Math.max(0, Math.min(1, fade)); // Clamp between 0 and 1

        // Fade sunlight intensity
        this.sunlight.intensity = 1.2 * fade;

        // Fade sun mesh
        if (this.sunMesh) {
            this.sunMesh.material.opacity = fade;
            this.sunMesh.visible = fade > 0.01;
        }

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