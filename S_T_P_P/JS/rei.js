import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x000020);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const geometry_rei = new THREE.SphereGeometry(4.5, 50, 50);
const material_rei = new THREE.MeshPhongMaterial({ color: 0xffffff });
const Plat_rei = new THREE.Mesh(geometry_rei, material_rei);
scene.add(Plat_rei);

const loader = new THREE.TextureLoader();
const textureRei = loader.load('../images/rei-cortado.png');

const geometryRei = new THREE.PlaneGeometry(3, 4);
const materialRei = new THREE.MeshPhongMaterial({ map: textureRei, transparent: true });
const reiMesh = new THREE.Mesh(geometryRei, materialRei);

const geometry_bebador = new THREE.SphereGeometry(9,100,100);
const material_bebador = new THREE.MeshPhongMaterial({ color: 0xffffff });
const Plat_bebador = new THREE.Mesh(geometry_bebador, material_bebador);
scene.add(Plat_bebador);

const loadere = new THREE.TextureLoader();
const texturebebabor = loader.load('../images/bebida.jpg');

const geometry_bebado = new THREE.PlaneGeometry(3, 4);
const material_bebado = new THREE.MeshPhongMaterial({ map: texturebebabor, transparent: true });
const bebadoMesh = new THREE.Mesh(geometry_bebado, material_bebado);
bebadoMesh.position.set(1.0,0.5,2.0);

const geometryPrincipe = new THREE.PlaneGeometry(3, 4);
const materialPrincipe = new THREE.MeshPhongMaterial({ map: textureRei, transparent: true });
const principeMesh = new THREE.Mesh(geometryPrincipe, materialPrincipe);
reiMesh.position.set(0, -5.8, 0);
scene.add(principeMesh);

reiMesh.position.set(0, 5.8, 0);
reiMesh.rotation.x = -0.55;
scene.add(reiMesh);

const directionalLight = new THREE.DirectionalLight(0xffcc44, 4);
directionalLight.position.set(100, 10, -200);
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x747474);
scene.add(ambientLight);

camera.position.z = 20;

var theta = 0.0;
var phi = 0.0;
const speed = 0.05; // Velocidade de movimento do príncipe

function animate() {
    Plat_rei.rotation.y += 0.001;
    Plat_bebador.rotation.x+=0.1;
    theta = 0.005 + theta;
    directionalLight.position.x = 100 * Math.cos(theta);
    directionalLight.position.z = 100 * Math.sin(theta);

    const dx = camera.position.x - reiMesh.position.x;
    const dz = camera.position.z - reiMesh.position.z;
    const angleY = Math.atan2(dx, dz);

    reiMesh.rotation.y = angleY;
    reiMesh.rotation.z = (2 * Math.sin(angleY)) / Math.PI;
    bebadoMesh.rotation.x=(4*Math.sin(theta)/2*Math.cos(theta);
    phi += 0.01;
    const radius = 7;
    principeMesh.position.set(
        radius * Math.cos(phi),
        5.8,
        radius * Math.sin(phi)
    );
    bebadoMesh.position.set(
     phi+=0.02;
     const radiues= 8;
     radiues * Math.cos(phi),
     6.8,
     radiues * Math.sin(phi)
    );
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        principeMesh.position.x -= speed;
    } else if (event.key === 'ArrowRight') {
        principeMesh.position.x += speed;
    }
});
