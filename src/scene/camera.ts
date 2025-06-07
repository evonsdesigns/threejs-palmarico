import * as THREE from 'three';

export function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 40; // zoom level
    const camera = new THREE.OrthographicCamera(
        -d * aspect, d * aspect,   // left, right
        d, -d,                     // top, bottom
        -3000,
        5000
    );


    camera.position.set(70, 70, 70);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = - Math.PI / 4;
    camera.rotation.x = Math.atan(- 1 / Math.sqrt(2));

    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -d * aspect;
        camera.right = d * aspect;
        camera.top = d;
        camera.bottom = -d;
        camera.updateProjectionMatrix();
    });

    return camera;
}