import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Object3D } from 'three';

export type BuildingAssets = {
    [key: string]: Object3D;
};

let buildingAssets: BuildingAssets = {};

async function loadBuildingAssets(assetList: { [key: string]: string }): Promise<BuildingAssets> {
    const loader = new GLTFLoader();

    const assets: BuildingAssets = {};
    const loadPromises = Object.entries(assetList).map(([name, url]) =>
        new Promise<void>((resolve, reject) => {
            loader.load(
                url,
                (gltf) => {
                    assets[name] = gltf.scene;
                    resolve();
                },
                undefined,
                (error) => {
                    console.error(`Error loading ${name} from ${url}:`, error);
                    reject(error);
                }
            );
        })
    );

    await Promise.all(loadPromises);
    return assets;
}

// Usage example (in another file):
// import { loadBuildingAssets, BuildingAssets } from './load-building-assets';
// const assetList = { house1: '/assets/house1.glb', barn: '/assets/barn.glb' };
// await loadBuildingAssets(assetList);
// Now you can import and use the `assets` object.

const assetsPathList = {
    house1: '/assets/house1.glb',
    // Add more assets as needed
}

export async function importBuildingAssets() {
    buildingAssets = await loadBuildingAssets(assetsPathList);
    return buildingAssets;
}

export function getBuildingAssets(): BuildingAssets {
    return buildingAssets;
}