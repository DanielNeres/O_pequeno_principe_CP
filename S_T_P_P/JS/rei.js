import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const scene_2 = new THREE.Scene();
let cena_atual = scene;
let cena_no_rei = true;
var fim = false;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define o back com uma cor um pouco azulada
scene.background = new THREE.Color(0x000020);
scene_2.background = new THREE.Color(0x000020);

// Planeta do Rei
var bumpMap_asteroide = new THREE.TextureLoader().load("../images/bump_asteroide_map.jpg");
const geometry_rei = new THREE.SphereGeometry(4.5, 50, 50);
const material_rei = new THREE.MeshPhongMaterial({ color: 0x610091, bumpMap: bumpMap_asteroide, bumpScale: 20 });
const Plat_rei = new THREE.Mesh(geometry_rei, material_rei);
scene.add(Plat_rei);

// Carrega as texturas
const loader = new THREE.TextureLoader();
const textureRei = loader.load('../images/rei-cortado.png');
const texturePrincipe = loader.load('../images/pequeno_principe_aviao.png');
const textureacendedor = loader.load('../images/acendedor_cortado.png');

// Define o Rei Como um Plano
const geometryRei = new THREE.PlaneGeometry(3, 4);
const materialRei = new THREE.MeshPhongMaterial({ map: textureRei, transparent: true });
const reiMesh = new THREE.Mesh(geometryRei, materialRei);
reiMesh.position.set(0, 5.8, 0);
reiMesh.rotation.x = -0.55;
scene.add(reiMesh);

// Define o Principe Como um Plano
const geometryPrincipe = new THREE.PlaneGeometry(1.5, 1.5);
const materialPrincipe = new THREE.MeshPhongMaterial({ map: texturePrincipe, transparent: true });
const principeMesh = new THREE.Mesh(geometryPrincipe, materialPrincipe);
scene.add(principeMesh);

// cria o Planeta do Acendedor
const geometry_acendedor = new THREE.SphereGeometry(6, 50, 50);
const material_acendedor = new THREE.MeshPhongMaterial({ color: 0x3398421, bumpMap: bumpMap_asteroide, bumpScale: 20 });
const Plat_acendedor = new THREE.Mesh(geometry_acendedor, material_acendedor);

// Define o Acendedor Como um Plano
const geometryacendedor = new THREE.PlaneGeometry(3, 4);
const materialacendedor = new THREE.MeshPhongMaterial({ map: textureacendedor, transparent: true });
const acendedorMesh = new THREE.Mesh(geometryacendedor, materialacendedor);
acendedorMesh.position.set(0, 7.9, 0);


const directionalLight = new THREE.DirectionalLight(0xffcc44, 4);
directionalLight.position.set(100, 10, -200);
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x747474);
scene.add(ambientLight);


function cria_balao(text, tamanho_fonte) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 5;

    // difene os parametros do balao
    const raio = 20;
    const width = 460;
    const height = 180;
    const x = 26;
    const y = 20;
    
    // Desenha o balao
    context.beginPath();
    context.moveTo(x + raio, y);
    context.lineTo(x + width - raio, y);
    context.quadraticCurveTo(x + width, y, x + width, y + raio);
    context.lineTo(x + width, y + height - raio);
    context.quadraticCurveTo(x + width, y + height, x + width - raio, y + height);
    context.lineTo(x + raio, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - raio);
    context.lineTo(x, y + raio);
    context.quadraticCurveTo(x, y, x + raio, y);
    context.closePath();
    context.fill();
    context.stroke();

    // Desenha a Seta
    context.beginPath();
    context.moveTo(360, 180);
    context.lineTo(400, 240);
    context.lineTo(440, 180);
    context.closePath();
    context.fill();
    context.stroke();

    // define a letra
    context.fillStyle = 'black';
    context.font = `${tamanho_fonte}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2 - 20);

    // retorna o balao
    return new THREE.CanvasTexture(canvas);
}

// cria os dialogos das duas cenas
const dialogGeometry = new THREE.PlaneGeometry(8, 3); 
const dialogMaterial = new THREE.MeshBasicMaterial({ 
    map: cria_balao("Olá! Meu Sudito, Sou Seu Rei!", 33), 
    transparent: true
});
const dialogGeometry_acendedor = new THREE.PlaneGeometry(14, 6); 
const dialogMaterial_acendedor = new THREE.MeshBasicMaterial({ 
    map: cria_balao("Olá pequenino! quer me dar uma Mão", 25), 
    transparent: true
});
const dialogo_rei = new THREE.Mesh(dialogGeometry, dialogMaterial);
const dialogo_acendedor = new THREE.Mesh(dialogGeometry_acendedor, dialogMaterial_acendedor);
scene.add(dialogo_rei);


// carrega o modelo, pegeui de marcos
function loadModel(object) {
    const loader = new GLTFLoader();

    loader.load(
        '../modelos/paper_airplane/scene.gltf',
        function (gltf) {
            cena_atual.add(gltf.scene);
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

// define os parametros responsaveis pela movimentação
let phi = 0.0; 
let theta = Math.PI / 2; 
const velocidade = 0.02; 

// calcula as cordenada esfericas da movimentação
let direction = new THREE.Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.cos(theta),
    Math.sin(theta) * Math.sin(phi)
);

// coloca uma imagem na frente da tela, finalizando a simulação
function fimSimulacao(imagePath) {
    fim = true; 

    const imgElement = document.createElement('img');
    imgElement.src = imagePath;
    
    imgElement.style.position = 'fixed';
    imgElement.style.top = '0';
    imgElement.style.left = '0';
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';  
    imgElement.style.zIndex = '1000';  
    imgElement.style.backgroundColor = 'black'; 
    imgElement.style.opacity = '1';

    document.body.appendChild(imgElement);
}

// lida com o evento ao clicar nas setas e x e z
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        phi -= velocidade; 
    } else if (event.key === 'ArrowLeft') {
        phi += velocidade; 
    } 
    if (event.key === 'ArrowUp') {
        theta -= velocidade; 
    } else if (event.key === 'ArrowDown') {
        theta += velocidade; 
    }
    if (!cena_no_rei) {
        if (event.key === 'x') {
            if (raio > 7) 
            raio -= 0.1; 
        } else if (event.key === 'z') {
            if(raio < 20)
            raio += 0.1; 
        }
    }

    direction.set(
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi)
    );
});

// começa a criar os balãos do rei
setTimeout(() => {
    const newTexture = cria_balao("Esse é Todo Meu Grande Reino!!", 30); 

    dialogo_rei.material.map = newTexture;
    dialogo_rei.material.needsUpdate = true; 

    dialogo_rei.geometry.dispose(); 
    dialogo_rei.geometry = new THREE.PlaneGeometry(10, 4); 
}, 5000);

setTimeout(() => {
    const newTexture = cria_balao("Use as setas para visitar ele", 33); 
    dialogo_rei.material.map = newTexture;
    dialogo_rei.material.needsUpdate = true; 

    dialogo_rei.geometry.dispose(); 
    dialogo_rei.geometry = new THREE.PlaneGeometry(8, 3);
}, 9000);

// retira o dialogo da cena
setTimeout(() => {
    cena_atual.remove(dialogo_rei); 
    dialogo_rei.geometry.dispose(); 
    dialogo_rei.material.dispose(); 
}, 15000);

// parametros da luz direcional
const luzRaio = 100;  
let luztetha = 0;

const aviao = { model: null };
let raio = 7;

loadModel(aviao);

function animate() {
    // para implementações futuras
    if (!fim) {
        // esta na cena do rei, carrega o aviao primeiro pra nao explodir o computador
        if (cena_no_rei && aviao.model) {
            const distanciaRei=aviao.model.position.distanceTo(reiMesh.position);
                 if(distanciaRei<raioColisaoAviao+raioColisaoRei){
                    console.log("Colisão com o rei detectada!");
                 }
            Plat_rei.rotation.y += 0.001;
            reiMesh.lookAt(camera.position);
            luztetha += 0.01; 
            directionalLight.position.x = luzRaio * Math.cos(luztetha);
            directionalLight.position.z = luzRaio * Math.sin(luztetha);
            dialogo_rei.lookAt(camera.position);
            // o principe chegou no polo sul troca de cena
            if (aviao.model.position.y < -6.5 && cena_no_rei) {
                cena_atual = scene_2;
                loadModel(aviao);
                scene_2.add(principeMesh);
                scene_2.add(ambientLight);
                scene_2.add(directionalLight);
                scene_2.add(Plat_acendedor)     ;
                cena_no_rei = false;
                scene_2.add(acendedorMesh);
                raio += 5;
                scene_2.add(dialogo_acendedor);
                dialogo_acendedor.position.set(acendedorMesh.position.x, acendedorMesh.position.y + 3.8, acendedorMesh.position.z);
                // define os dialogos do apagador
                setTimeout(() => {
                    const newTexture = cria_balao("Apago essa luz Todo Dia", 27); 
                    dialogo_acendedor.material.map = newTexture;
                    dialogo_acendedor.material.needsUpdate = true;
    
                    dialogo_acendedor.geometry.dispose(); 
                    dialogo_acendedor.geometry = new THREE.PlaneGeometry(14, 6);
                }, 6000);

                setTimeout(() => {
                    const newTexture = cria_balao("Nunca Durmo!!! Capitalismo HeHE", 27); 
                    dialogo_acendedor.material.map = newTexture;
                    dialogo_acendedor.material.needsUpdate = true;
    
                    dialogo_acendedor.geometry.dispose(); 
                    dialogo_acendedor.geometry = new THREE.PlaneGeometry(14, 6.5);
                }, 11000);
    
                setTimeout(() => {
                    const newTexture = cria_balao("Pode apagar essa luz para mim!", 28); 
                    dialogo_acendedor.material.map = newTexture;
                    dialogo_acendedor.material.needsUpdate = true;
    
                    dialogo_acendedor.geometry.dispose(); 
                    dialogo_acendedor.geometry = new THREE.PlaneGeometry(14, 5);
                }, 15000);
    
                setTimeout(() => {
                    const newTexture = cria_balao("use X e Z para subir e descer", 30); 
                    dialogo_acendedor.material.map = newTexture;
                    dialogo_acendedor.material.needsUpdate = true;
    
                    dialogo_acendedor.geometry.dispose(); 
                    dialogo_acendedor.geometry = new THREE.PlaneGeometry(12, 5);
                }, 19000); 

                setTimeout(() => {
                    cena_atual.remove(dialogo_acendedor); 
                    dialogo_acendedor.geometry.dispose(); 
                    dialogo_acendedor.material.dispose(); 
                }, 25000);
            }
        } else if(aviao.model){
             const distanciaAcendedor=aviao.model.position.distanceTo(acendedorMesh.position);
        if(distanciaAcendedor<raioColisaoAviao+raioColisaoAcendedor){
            console.log("Colisão com o acendedor detectada!");
        } 
            acendedorMesh.lookAt(camera.position);
            Plat_acendedor.rotation.y += 0.001;
            luztetha += 0.01;
            directionalLight.position.x = luzRaio * Math.cos(luztetha);
            directionalLight.position.y = luzRaio * Math.sin(luztetha);
            dialogo_acendedor.lookAt(camera.position);
            // apagou a luz
            if(aviao.model.position.y >= 7 && raio <= 8 && directionalLight.position.y > 0){
                fimSimulacao('../images/vitoria.jpg');
                fim = true;
            }
            
        }
        
        // calcula as posições esfericas do aviao
        const x = raio * direction.x;
        const y = raio * direction.y; 
        const z = raio * direction.z;

        if (aviao.model) {
            aviao.model.position.set(x, y, z);

            const olhar_para = new THREE.Vector3(
                aviao.model.position.x,
                aviao.model.position.y,
                aviao.model.position.z 
            );
            // tem que melhorar
            aviao.model.lookAt(olhar_para);
            // o principe acompanha o aviao
            principeMesh.position.set(x, y + 0.5, z);
        }
        
        // camera dez unidades acima do aviao
        camera.position.set(x + 10 * direction.x, y + 15 * direction.y, z + 10 * direction.z);
        camera.lookAt(x, y, z);
        principeMesh.lookAt(camera.position.x, camera.position.y, camera.position.z);
        dialogo_rei.position.set(reiMesh.position.x, reiMesh.position.y + 3.3, reiMesh.position.z);
    }

    renderer.render(cena_atual, camera);
}

renderer.setAnimationLoop(animate);
