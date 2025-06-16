import { Vector3, BoxGeometry, MeshStandardMaterial, Mesh, Color } from "three";
import GameEntity from "./GameEntity";

export default class HouseTenement extends GameEntity {
  constructor(position: Vector3) {
    super(position);

    // Define the dimensions of the apartment complex
    const width = 16;
    const height = 4;
    const depth = 8;

    // Create the geometry for the apartment complex
    const geometry = new BoxGeometry(width, height, depth);

    // Create a material for the apartment complex
    const material = new MeshStandardMaterial({ color: new Color("blue") });

    // Create the mesh for the apartment complex
    const apartmentComplex = new Mesh(geometry, material);

    apartmentComplex.position.copy(position);

    // Add the apartment complex to the entity's mesh
    this._mesh.add(apartmentComplex);
  }
}