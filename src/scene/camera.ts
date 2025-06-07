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
    // azimuth: rotation around Y axis (in radians)
    // elevation: angle from XZ plane up (in radians)
    camera.position.x = center.x + radius * Math.cos(elevation) * Math.sin(azimuth);
    camera.position.y = center.y + radius * Math.sin(elevation);
    camera.position.z = center.z + radius * Math.cos(elevation) * Math.cos(azimuth);
    camera.lookAt(center);
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const center = new THREE.Vector3(0, 0, 0);
    let radius = 70;
    let azimuth = Math.PI / 4; // 45 degrees
    const elevation = Math.PI / 4; // 45 degrees

    setCameraSpherical(camera, center, radius, azimuth, elevation);

    camera.up.set(0, 1, 0);

    clampCameraDistance(camera, center, minDistance, maxDistance);

    window.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            // Calculate current radius (zoom level) before rotating
            const camVec = camera.position.clone().sub(center);
            radius = camVec.length();

            azimuth += Math.PI / 2;
            setCameraSpherical(camera, center, radius, azimuth, elevation);
            clampCameraDistance(camera, center, minDistance, maxDistance);
        }
    });

    return camera;
}