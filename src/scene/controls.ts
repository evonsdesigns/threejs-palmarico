import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { Camera, Renderer, Vector3 } from 'three';

export function createMapControls(camera: Camera, renderer: Renderer) {
    const controls = new MapControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, -10, 0);
    controls.maxZoom = 10.0;
    controls.minZoom = 0.4;
    controls.enableRotate = false;

    window.addEventListener('keydown', (event) => {
        const panAmount = 5;
        const right = new Vector3();
        const up = new Vector3();
        camera.matrix.extractBasis(right, up, new Vector3());

        let panOffset = new Vector3();

        switch (event.key) {
            case 'ArrowLeft':
                panOffset.copy(right).multiplyScalar(-panAmount);
                break;
            case 'ArrowRight':
                panOffset.copy(right).multiplyScalar(panAmount);
                break;
            case 'ArrowUp':
                panOffset.copy(up).multiplyScalar(panAmount);
                break;
            case 'ArrowDown':
                panOffset.copy(up).multiplyScalar(-panAmount);
                break;
            default:
                return; // Don't update controls if no pan
        }

        camera.position.add(panOffset);
        controls.target.add(panOffset);
        controls.update();
    });

    controls.update();

    return controls;
}