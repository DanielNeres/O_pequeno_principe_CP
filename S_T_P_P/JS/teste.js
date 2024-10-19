import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Criar a esfera
const geometry = new THREE.SphereGeometry(50, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Criar o avião
const airplaneGeometry = new THREE.BoxGeometry(1, 1, 4);
const airplaneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const airplane = new THREE.Mesh(airplaneGeometry, airplaneMaterial);
scene.add(airplane);

// Posicionar o avião na superfície da esfera
let theta = 0, theta_prox; // Ângulo horizontal
let phi = Math.PI / 2; // Ângulo vertical
const radius = 50; // Raio da esfera
const speed = 1000; // Velocidade de movimento
const rotationSpeed = 0.02; // Velocidade de rotação

airplane.position.set(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
);
camera.position.set(0, 60, 100);
camera.lookAt(airplane.position);

// Vetor de direção inicial
let direction = new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
);

// Função para atualizar a direção do avião
function updateAirplaneDirection(event) {
    if (event.key === 'ArrowRight') {
        theta += 0.05;
    } else if (event.key === 'ArrowLeft') {
        theta -= 0.05;
    }
}

// Adicionar evento de teclado
window.addEventListener('keydown', updateAirplaneDirection);

// Função de animação
function animate() {
    airplane.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );

    // Atualizar os ângulos theta e phi com base na nova posição
    //theta = Math.atan2(airplane.position.z, airplane.position.x);
    //phi = Math.acos(airplane.position.y / radius);
    phi += 0.01;

    renderer.render(scene, camera);
}
animate();