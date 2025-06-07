
import * as THREE from 'three';

export function getWaveInfo(x, z, time, waves) {

    const pos = new THREE.Vector3();
    const tangent = new THREE.Vector3(1, 0, 0);
    const binormal = new THREE.Vector3(0, 0, 1);
    Object.keys(waves).forEach((wave) => {

        const w = waves[wave];
        const k = (Math.PI * 2) / w.wavelength;
        const c = Math.sqrt(9.8 / k);
        const d = new THREE.Vector2(
            Math.sin((w.direction * Math.PI) / 180),
            - Math.cos((w.direction * Math.PI) / 180)
        );
        const f = k * (d.dot(new THREE.Vector2(x, z)) - c * time);
        const a = w.steepness / k;

        pos.x += d.y * (a * Math.cos(f));
        pos.y += a * Math.sin(f);
        pos.z += d.x * (a * Math.cos(f));

        tangent.x += - d.x * d.x * (w.steepness * Math.sin(f));
        tangent.y += d.x * (w.steepness * Math.cos(f));
        tangent.z += - d.x * d.y * (w.steepness * Math.sin(f));

        binormal.x += - d.x * d.y * (w.steepness * Math.sin(f));
        binormal.y += d.y * (w.steepness * Math.cos(f));
        binormal.z += - d.y * d.y * (w.steepness * Math.sin(f));

    });

    const normal = binormal.cross(tangent).normalize();

    return { position: pos, normal: normal };

}