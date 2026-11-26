import * as THREE from "three";

export class WaterScene {
  private readonly time = { value: 0 };
  private readonly daylight = { value: 1 };

  constructor(scene: THREE.Scene, heightAt: (x: number, z: number) => number | null, terrainSize: number) {
    const resolution = 257;
    const pixels = new Uint8Array(resolution * resolution * 4);
    for (let z = 0; z < resolution; z++) {
      for (let x = 0; x < resolution; x++) {
        const height = heightAt((x / (resolution - 1) - 0.5) * terrainSize, (z / (resolution - 1) - 0.5) * terrainSize);
        if (height === null) throw new Error("Unable to sample island terrain for the water.");
        const offset = (z * resolution + x) * 4;
        pixels[offset] = Math.round(THREE.MathUtils.clamp(-height / 3, 0, 1) * 255);
        pixels[offset + 3] = 255;
      }
    }
    const depth = new THREE.DataTexture(pixels, resolution, resolution, THREE.RGBAFormat);
    depth.magFilter = depth.minFilter = THREE.LinearFilter;
    depth.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial();
    material.onBeforeCompile = (shader) => {
      shader.uniforms.waterTime = this.time;
      shader.uniforms.daylight = this.daylight;
      shader.uniforms.terrainDepth = { value: depth };
      shader.uniforms.terrainSize = { value: terrainSize };
      shader.uniforms.shallowColor = { value: new THREE.Color(0x279987) };
      shader.uniforms.deepColor = { value: new THREE.Color(0x075667) };
      shader.vertexShader = shader.vertexShader
        .replace("void main() {", "varying vec2 vWaterPosition;\nvoid main() {")
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvWaterPosition = (modelMatrix * vec4(transformed, 1.0)).xz;");
      shader.fragmentShader = shader.fragmentShader
        .replace("void main() {", `
          varying vec2 vWaterPosition;
          uniform sampler2D terrainDepth;
          uniform float terrainSize;
          uniform float waterTime;
          uniform float daylight;
          uniform vec3 shallowColor;
          uniform vec3 deepColor;
          float waterHash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float waterNoise(vec2 p) {
            vec2 cell = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(waterHash(cell), waterHash(cell + vec2(1.0, 0.0)), f.x),
              mix(waterHash(cell + vec2(0.0, 1.0)), waterHash(cell + vec2(1.0, 1.0)), f.x), f.y
            );
          }
          void main() {`)
        .replace("#include <color_fragment>", `#include <color_fragment>
          vec2 depthUv = clamp(vWaterPosition / terrainSize + 0.5, 0.0, 1.0);
          float depth = texture2D(terrainDepth, depthUv).r;
          float variation = waterNoise(vWaterPosition * 0.035);
          float ripples = waterNoise(vWaterPosition * 0.8 + vec2(waterTime * 0.08, waterTime * 0.05));
          diffuseColor.rgb = mix(shallowColor, deepColor, smoothstep(0.05, 0.85, depth));
          diffuseColor.rgb *= mix(0.92, 1.08, variation) * mix(0.96, 1.04, ripples);
          diffuseColor.rgb *= mix(vec3(0.4, 0.52, 0.65), vec3(1.0), daylight);`);
    };
    const water = new THREE.Mesh(new THREE.PlaneGeometry(2048, 2048), material);
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
  }

  update(delta: number) {
    this.time.value += delta;
  }

  setDaylight(daylight: number) {
    this.daylight.value = daylight;
  }
}
