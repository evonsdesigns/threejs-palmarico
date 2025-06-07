import * as THREE from 'three';

const minDistance = 20;
const maxDistance = 200;

function clampCameraDistance(camera: THREE.Camera, center: THREE.Vector3, min: number, max: number) {
    const camVec = camera.position.clone().sub(center);
    const distance = camVec.length();

    if (distance < min) {
        camVec.setLength(min);
        camera.position.copy(center.clone().add(camVec));
    }
    if (distance > max) {
        camVec.setLength(max);
        camera.position.copy(center.clone().add(camVec));
    }
}

function setCameraSpherical(camera: THREE.Camera, center: THREE.Vector3, radius: number, azimuth: number, elevation: number) {
    camera.position.x = center.x + radius * Math.cos(elevation) * Math.sin(azimuth);
    camera.position.y = center.y + radius * Math.sin(elevation);
    camera.position.z = center.z + radius * Math.cos(elevation) * Math.cos(azimuth);
    camera.lookAt(center);
}

export function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 40; // zoom level

    const camera = new THREE.OrthographicCamera(
        -d * aspect, d * aspect,   // left, right
        d, -d,                     // top, bottom
        0.1,
        1000
    );

    let center = new THREE.Vector3(0, 0, 0);
    let radius = 70;
    let azimuth = Math.PI / 4; // 45 degrees
    const elevation = Math.PI / 4; // 45 degrees

    setCameraSpherical(camera, center, radius, azimuth, elevation);

    camera.up.set(0, 1, 0);

    window.addEventListener('keydown', (event) => {

        switch (event.key) {
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case 'ArrowLeft':
                break;
            case 'ArrowRight':
                break;
            case 'r':
            case 'R':
                {
                    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                }
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