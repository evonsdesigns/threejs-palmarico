import * as THREE from "three";

type LitBuilding = { materials: THREE.MeshStandardMaterial[]; position: THREE.Vector3 };

export function markNightMaterial(material: THREE.MeshStandardMaterial) {
  material.emissive.setHex(0xffc16a);
  material.emissiveIntensity = 0;
  material.userData.nightLight = true;
}

export class BuildingLights {
  private readonly buildings = new Map<THREE.Group, LitBuilding>();
  private readonly lights: THREE.PointLight[];
  private night = 0;

  constructor(scene: THREE.Scene) {
    this.lights = Array.from({ length: 6 }, () => {
      const light = new THREE.PointLight(0xffb85c, 0, 10, 2);
      scene.add(light);
      return light;
    });
  }

  add(model: THREE.Group, frontOffset: number) {
    const materials = new Set<THREE.MeshStandardMaterial>();
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const list = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of list) {
        if (material instanceof THREE.MeshStandardMaterial && material.userData.nightLight) materials.add(material);
      }
    });
    const position = new THREE.Vector3(0, 2.8, frontOffset)
      .applyQuaternion(model.quaternion)
      .add(model.position);
    for (const material of materials) material.emissiveIntensity = this.night * 0.9;
    this.buildings.set(model, { materials: [...materials], position });
  }

  remove(model: THREE.Group) {
    this.buildings.delete(model);
  }

  update(daylight: number, target: THREE.Vector3) {
    this.night = 1 - daylight;
    for (const building of this.buildings.values()) {
      for (const material of building.materials) material.emissiveIntensity = this.night * 0.9;
    }
    const nearest = this.night > 0
      ? [...this.buildings.values()].sort((a, b) => a.position.distanceToSquared(target) - b.position.distanceToSquared(target)).slice(0, this.lights.length)
      : [];
    this.lights.forEach((light, index) => {
      const building = nearest[index];
      light.intensity = building ? this.night * 25 : 0;
      if (building) light.position.copy(building.position);
    });
  }
}
