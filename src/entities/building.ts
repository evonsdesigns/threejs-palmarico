import { Mesh, MeshStandardMaterial, BoxGeometry, Group, Vector3 } from "three";

export default class Building {
    public mesh: Group;

    constructor(position: Vector3) {
        const group = new Group();

        // --- House Body ---
        const bodyGeometry = new BoxGeometry(14, 6, 10);
        const bodyMaterial = new MeshStandardMaterial({ color: 0x3a8ec1 }); // softer blue
        const body = new Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 3;
        group.add(body);

        // --- Roof (gabled, overhanging) ---
        const roofMaterial = new MeshStandardMaterial({ color: 0x8b6b4a, roughness: 1 });
        const roofGeometry = new BoxGeometry(16, 0.6, 12); // wider and longer
        const roof = new Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 7, 0);
        roof.rotation.x = Math.PI / 7; // gentler slope
        group.add(roof);

        // --- Porch ---
        const porchGeometry = new BoxGeometry(8, 0.3, 2.5);
        const porchMaterial = new MeshStandardMaterial({ color: 0x8d5524 });
        const porch = new Mesh(porchGeometry, porchMaterial);
        porch.position.set(0, 1.5, 6.5);
        group.add(porch);

        // --- Porch posts & rails ---
        const postGeometry = new BoxGeometry(0.2, 2, 0.2);
        for (const x of [-3.5, 3.5]) {
            const post = new Mesh(postGeometry, porchMaterial);
            post.position.set(x, 2, 7.5);
            group.add(post);
        }
        // Rails
        const railGeometry = new BoxGeometry(7, 0.1, 0.1);
        for (let i = 0; i < 3; i++) {
            const rail = new Mesh(railGeometry, porchMaterial);
            rail.position.set(0, 2 + i * 0.3, 7.5);
            group.add(rail);
        }

        // --- Windows with blue frames and awnings ---
        const windowGeometry = new BoxGeometry(2, 2, 0.1);
        const frameMaterial = new MeshStandardMaterial({ color: 0x2a4d7a });
        const glassMaterial = new MeshStandardMaterial({ color: 0xffffff });
        for (const x of [-4, 4]) {
            // Frame
            const frame = new Mesh(new BoxGeometry(2.2, 2.2, 0.12), frameMaterial);
            frame.position.set(x, 3.5, 5.1);
            group.add(frame);
            // Glass
            const glass = new Mesh(windowGeometry, glassMaterial);
            glass.position.set(x, 3.5, 5.15);
            group.add(glass);
            // Awning
            const awningGeometry = new BoxGeometry(2.4, 0.3, 0.7);
            const awningMaterial = new MeshStandardMaterial({ color: 0xffffff });
            const awning = new Mesh(awningGeometry, awningMaterial);
            awning.position.set(x, 4.7, 5.4);
            awning.rotation.x = -Math.PI / 5;
            group.add(awning);
        }

        // --- Door (front) ---
        const doorGeometry = new BoxGeometry(1.5, 3, 0.1);
        const doorMaterial = new MeshStandardMaterial({ color: 0x6b4f27 });
        const door = new Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 2.5, 5.1);
        group.add(door);

        group.position.copy(position);
        this.mesh = group;
    }
}