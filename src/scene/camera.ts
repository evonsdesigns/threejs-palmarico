import * as THREE from 'three';

export function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 40; // zoom level

    const camera = new THREE.OrthographicCamera(
        -d * aspect, d * aspect,   // left, right
        d, -d,                     // top, bottom
        0.1,
        1000
    );
    

    camera.position.set(70, 70, 70);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = - Math.PI / 4;
    camera.rotation.x = Math.atan(- 1 / Math.sqrt(2));
    let xMoveAmount = 0;
    let yMoveAmount = 0;
    let moveIncrement = 5;

    window.addEventListener('keydown', (event) => {

        switch (event.key) {
            case 'ArrowLeft':
                xMoveAmount -= moveIncrement;
                camera.setViewOffset(d * 2, d * 2, xMoveAmount, 0, d * 2, d * 2);
                break;
            case 'ArrowRight':
                xMoveAmount += moveIncrement;
                camera.setViewOffset(d * 2, d * 2, xMoveAmount, 0, d * 2, d * 2);
                break;
            case 'ArrowUp':
                yMoveAmount -= moveIncrement;
                camera.setViewOffset(d * 2, d * 2, 0, yMoveAmount, d * 2, d * 2);
                break;
            case 'ArrowDown':
                yMoveAmount += moveIncrement;
                camera.setViewOffset(d * 2, d * 2, 0, yMoveAmount, d * 2, d * 2);
                break;
            case 'r':
            case 'R':
                camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                break;
        }
    });

    // Handle resize for orthographic camera
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