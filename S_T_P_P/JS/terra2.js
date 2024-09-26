import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

var qualidade = 130;
const grupo = new THREE.Group();
scene.add(grupo);

const textura = new THREE.TextureLoader().load("../images/superfice_terra.jpg");

const pontos_mat = new THREE.PointsMaterial({
    //color: 0x0000ff,
    size: 0.01,
    map: textura
});
const pontos_geo = new THREE.IcosahedronGeometry( 1, qualidade );
const pontos = new THREE.Points(pontos_geo, pontos_mat);
grupo.add(pontos);

camera.position.z = 5;

function animate() {

	grupo.rotation.y += 0.01;

	renderer.render( scene, camera );

}