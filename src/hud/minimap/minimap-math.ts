import * as THREE from "three";

export function minimapPoint(clientX: number, clientY: number, rect: DOMRect) {
  const dx = clientX - (rect.left + rect.width / 2);
  const dy = clientY - (rect.top + rect.height / 2);
  return { x: 0.5 + (dx + dy) / rect.width, z: 0.5 + (dy - dx) / rect.height };
}

export function cameraGroundOutline(camera: THREE.Camera, worldSize: number) {
  camera.updateMatrixWorld();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  return [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([x, y]) => {
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const ray = raycaster.ray;
    const denominator = plane.normal.dot(ray.direction);
    if (denominator === 0) throw new Error("Cannot project a horizontal camera view onto the map.");
    const point = ray.at(-plane.distanceToPoint(ray.origin) / denominator, new THREE.Vector3());
    return { x: point.x / worldSize + 0.5, z: point.z / worldSize + 0.5 };
  });
}
