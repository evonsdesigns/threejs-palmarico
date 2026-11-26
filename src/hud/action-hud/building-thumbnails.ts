import * as THREE from "three";
import { BuildingType } from "../../logic/game";
import { createBuilding } from "../../scene/buildings";

const cache = new Map<BuildingType, string>();

export function buildingThumbnails(types: readonly BuildingType[]): Map<BuildingType, string> {
  const missing = Array.from(new Set(types)).filter((type) => !cache.has(type));
  if (!missing.length) return new Map(types.map((type) => [type, cache.get(type)!]));

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(180, 120);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff4dd, 0x687d63, 2));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(20, 40, 30);
  scene.add(sun);

  try {
    for (const type of missing) {
      const model = createBuilding(type);
      scene.add(model);
      try {
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const height = Math.max((size.x + size.z) * 0.8 / 1.5, (size.x + size.z) * 0.38 + size.y * 0.85) * 1.1;
        const camera = new THREE.OrthographicCamera(-height * 0.75, height * 0.75, height / 2, -height / 2, 0.1, 200);
        camera.position.copy(center).add(new THREE.Vector3(40, 50, 40));
        camera.lookAt(center);
        renderer.render(scene, camera);
        cache.set(type, renderer.domElement.toDataURL("image/png"));
      } finally {
        scene.remove(model);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => material.dispose());
          }
        });
      }
    }
  } finally {
    renderer.dispose();
  }
  return new Map(types.map((type) => [type, cache.get(type)!]));
}
