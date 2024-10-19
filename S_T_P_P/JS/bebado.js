import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var currentScene = scene;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x000020);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();


var bumpMap_asteroide = new THREE.TextureLoader().load("../images/bump_asteroide_map.jpg");
const geometry_rei = new THREE.SphereGeometry(4.5, 50, 50);
const material_rei = new THREE.MeshPhongMaterial({ color: 0x610091, bumpMap: bumpMap_asteroide, bumpScale: 20 });
const Plat_rei = new THREE.Mesh(geometry_rei, material_rei);
scene.add(Plat_rei);


const loader = new THREE.TextureLoader();
const textureRei = loader.load('../images/rei-cortado.png');
const texturePrincipe = loader.load('../images/pequeno_principe_aviao.png');
const texturevitoria = loader.load('../images/vitoria.jpg');

const geometryRei = new THREE.PlaneGeometry(3, 4);
const materialRei = new THREE.MeshPhongMaterial({ map: textureRei, transparent: true });
const reiMesh = new THREE.Mesh(geometryRei, materialRei);
reiMesh.position.set(0, 5.8, 0);
reiMesh.rotation.x = -0.55;
scene.add(reiMesh);


const geometryvitoria = new THREE.PlaneGeometry(1, 1);
const materialvitoria = new THREE.MeshPhongMaterial({ map: texturevitoria, transparent: true });
const vitoria = new THREE.Mesh(geometryvitoria, materialvitoria);
var fim = false;

const geometryPrincipe = new THREE.PlaneGeometry(1.5, 1.5);
const materialPrincipe = new THREE.MeshPhongMaterial({ map: texturePrincipe, transparent: true });
const principeMesh = new THREE.Mesh(geometryPrincipe, materialPrincipe);
reiMesh.position.set(0, -5.8, 0);
scene.add(principeMesh);

const directionalLight = new THREE.DirectionalLight(0xffcc44, 4);
directionalLight.position.set(100, 10, -200);
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x747474);
scene.add(ambientLight);


var bumpMap_asteroide = new THREE.TextureLoader().load("../images/bump_asteroide_map.jpg");
const geometry_bebado = new THREE.SphereGeometry(4.5, 50, 50);
const material_bebado = new THREE.MeshPhongMaterial({ color: 0x610091, bumpMap: bumpMap_asteroide, bumpScale: 20 });
const Plat_bebado = new THREE.Mesh(geometry_bebado, material_bebado);
scene2.add(Plat_bebado);

const texturebebado = loader.load('../images/rei-cortado.png');

const geometrybebado = new THREE.PlaneGeometry(3, 4);
const materialbebado = new THREE.MeshPhongMaterial({ map: texturebebado, transparent: true });
const bebadoMesh = new THREE.Mesh(geometrybebado, materialbebado);

scene2.add(principeMesh);

bebadoMesh.position.set(0, 5.8, 0);
bebadoMesh.rotation.x = -0.55;
scene2.add(bebadoMesh);

const directionalLight_bebado = new THREE.DirectionalLight(0xffcc44, 4);
directionalLight_bebado.position.set(100, 10, -200);
scene2.add(directionalLight_bebado);


function loadModel(object) {
    const loader = new GLTFLoader();

    loader.load(
        '../modelos/paper_airplane/scene.gltf',
        function (gltf) {
            scene.add(gltf.scene);
            object.model = gltf.scene.children[0];
            object.model.scale.set(2, 2, 2);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened', error);
        }
    );
}


let phi = 0.0; 
let theta = Math.PI / 2; 

const radius = 7;

const turnSpeed = 0.02; 

let direction = new THREE.Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.cos(theta),
    Math.sin(theta) * Math.sin(phi)
);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        phi -= turnSpeed; 
    } else if (event.key === 'ArrowLeft') {
        phi += turnSpeed; 
    } 
    if (event.key === 'ArrowUp') {
        theta += turnSpeed; 
    } else if (event.key === 'ArrowDown') {
        theta -= turnSpeed; 
    }

    direction.set(
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi)
    );
});


const aviao = { model: null };

loadModel(aviao);

function animate() {
    if (!fim) {
        
    //Plat_rei.rotation.y += 0.001;

    const x = radius * direction.x;
    const y = radius * direction.y; 
    const z = radius * direction.z;

    if (aviao.model) {
        aviao.model.position.set(x, y, z);

        const olhar_para = new THREE.Vector3(
            aviao.model.position.x,
            aviao.model.position.y,
            aviao.model.position.z 
        );

        aviao.model.lookAt(olhar_para);

        principeMesh.position.set(x, y + 0.5, z);
        if (aviao.model.position.y < -6.5) {
            vitoria.position.set(camera.position.x, camera.position.y + 0.1, camera.position.z );
            //scene.add(vitoria);
            //vitoria.lookAt(camera.position)
            //fim = true;
            currentScene = scene2;
        }
    }
    
    camera.position.set(x + 10 * direction.x, y + 15 * direction.y, z + 10 * direction.z);
    
    camera.lookAt(x, y, z);

    principeMesh.lookAt(camera.position.x, camera.position.y, camera.position.z);
    reiMesh.lookAt(camera.position.x, camera.position.y, camera.position.z);
    
    }

    renderer.render(currentScene, camera);
}

renderer.setAnimationLoop(animate);
