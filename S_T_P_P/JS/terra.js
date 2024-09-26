import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
 
 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
 
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color(0x000020);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

 
const terraTexture = new THREE.TextureLoader().load("../images/superfice_terra.jpg");
var bumpMap_terra = new THREE.TextureLoader().load("../images/profundidade_terra.jpg");
const geometry_terra = new THREE.SphereGeometry( 40, 100, 100);
const material_terra = new THREE.MeshPhongMaterial({bumpMap: bumpMap_terra, bumpScale: 20 });
const terra = new THREE.Mesh( geometry_terra, material_terra );
material_terra.map = terraTexture;
scene.add( terra );
terra.rotation.x = -0.08


var bumpMap__lua = new THREE.TextureLoader().load("../images/profundidade_lua.jpg");
const luaTexture = new THREE.TextureLoader().load("../images/superfice_lua.jpg");
const geometry_lua = new THREE.SphereGeometry( 10, 100, 100);
const material_lua = new THREE.MeshPhongMaterial({bumpMap: bumpMap__lua, bumpScale: 4 });
const lua = new THREE.Mesh( geometry_lua, material_lua );
lua.position.x = 60;
lua.position.z = 30;
material_lua.map = luaTexture;
scene.add( lua );

var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(100,10,-200);
directionalLight.name='directional';
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x111111);
ambientLight.name='ambient';
scene.add(ambientLight);
 
 
camera.position.z = 100;
 
function animate() {
	terra.rotation.y += 0.001;
	lua.rotation.y += 0.001;
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );