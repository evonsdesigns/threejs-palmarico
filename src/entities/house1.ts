import { Vector3 } from "three";
import { getBuildingAssets } from "../scene/load-building-assets";
import GameEntity from "./GameEntity";

export default class House1 extends GameEntity {
    constructor(position: Vector3) {
        super(position);
        const model = getBuildingAssets().house1.clone(true);

        model.position.copy(position);
        model.scale.set(10, 10, 10);
        model.position.y = 1; 
        this._mesh.add(model);
    }
}