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

var qualidade = 10;  // Nível de detalhe da geometria

// Definir a cor aproximada do oceano e a tolerância
const oceanColor = { r: 70, g: 130, b: 180 };  // Aproximado para azul dos oceanos
const tolerance = 30;  // Tolerância para detectar variações de cor

// Função para verificar se uma cor corresponde à cor do oceano
function isOceanColor(color, oceanColor, tolerance) {
    return Math.abs(color.r - oceanColor.r) <= tolerance &&
           Math.abs(color.g - oceanColor.g) <= tolerance &&
           Math.abs(color.b - oceanColor.b) <= tolerance;
}

// Função para obter a cor de um ponto UV na textura
function getColorAtUV(u, v, canvas, data) {
    const x = Math.floor(u * canvas.width);
    const y = Math.floor(v * canvas.height);

    const index = (y * canvas.width + x) * 4; // Cada pixel tem 4 valores (RGBA)

    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];

    return { r, g, b, a };
}

// Carregar a textura da Terra de forma assíncrona
const textureLoader = new THREE.TextureLoader();
textureLoader.load("../images/superfice_terra.jpg", function(textura) {

    // Criar a geometria do icosaedro
    const pontos_geo = new THREE.IcosahedronGeometry(1, qualidade);
    
    // Usar um material básico sem textura para os pontos
    const pontos_mat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xffffff  // Cor neutra, sem textura
    });

    const uvArray = pontos_geo.attributes.uv.array;  // Coordenadas UV da geometria
    const vertices = pontos_geo.attributes.position.array;  // Posição dos vértices
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Configurar o tamanho do canvas de acordo com o tamanho da textura
    canvas.width = textura.image.width;
    canvas.height = textura.image.height;

    // Desenhar a imagem da textura no canvas
    ctx.drawImage(textura.image, 0, 0, canvas.width, canvas.height);

    // Obter os dados de pixel da imagem
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Lista para armazenar os vértices válidos (terra)
    const validVertices = [];

    // Iterar sobre os vértices e coordenadas UV
    for (let i = 0; i < uvArray.length; i += 2) {
        const u = uvArray[i];
        const v = uvArray[i + 1];

        // Obter a cor na posição UV correspondente
        const color = getColorAtUV(u, v, canvas, data);

        // Verificar se o ponto está no oceano
        if (!isOceanColor(color, oceanColor, tolerance)) {
            // Se for um ponto válido (terra), adicionar as coordenadas x, y, z do vértice
            validVertices.push(vertices[i * 1.5], vertices[i * 1.5 + 1], vertices[i * 1.5 + 2]);
        }
    }

    // Criar nova geometria apenas com os vértices válidos
    const validGeo = new THREE.BufferGeometry();
    const validVerticesArray = new Float32Array(validVertices);
    validGeo.setAttribute('position', new THREE.BufferAttribute(validVerticesArray, 3));

    // Criar os pontos com a nova geometria filtrada
    const pontosValidos = new THREE.Points(validGeo, pontos_mat);
    scene.add(pontosValidos);

    // Mostrar no console quantos pontos válidos (terra) foram encontrados
    console.log('Número de pontos válidos:', validVertices.length / 3);  // Dividir por 3 (x, y, z)
});

camera.position.z = 10;

// Função de animação para renderizar a cena
function animate() {
    renderer.render(scene, camera);
}
