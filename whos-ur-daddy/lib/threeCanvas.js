import * as THREE from 'three';
import { OBJLoader } from 'three/addons/objLoader.js';

let canvasWidth = 256;
let canvasHeight = 100;

let camera, scene, renderer;
const clock = new THREE.Clock();
let sceneObject;
let sceneReady = false;

init();

function init() {

    camera = new THREE.PerspectiveCamera(10, canvasWidth / canvasHeight, 0.1, 200);
    camera.position.z = 100;

    // scene

    scene = new THREE.Scene();

    const hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1);
    scene.add(hemisphereLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 4);
    dirLight.position.set(-10, 10, 10);
    scene.add(dirLight);

    // manager

    function loadModel() {
        sceneObject.traverse(function (child) {
            if (child.isMesh) {
                child.material.map = texture;
            }
        });
        scene.add(sceneObject);
        render();
    }

    const manager = new THREE.LoadingManager(loadModel);

    // texture

    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load('./obj/mirragames_albedo.png', render);
    texture.colorSpace = THREE.SRGBColorSpace;

    // model

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
        }
    }

    function onError() {

    }

    const loader = new OBJLoader(manager);
    loader.load('./obj/mirragames.obj', function (obj) {
        sceneObject = obj;
        sceneReady = true;
    }, onProgress, onError);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 0.0);
    document.getElementById("three-canvas").appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    // Check for mobile size.
    if (window.innerWidth <= 500 || window.innerHeight <= 500) {
        // Mobile canvas size.
        canvasWidth = 128;
        canvasHeight = 50;
    } else {
        // Desktop canvas size.
        canvasWidth = 256;
        canvasHeight = 100;
    }
    // Update renderer size.
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, canvasHeight);
}

function render() {
    requestAnimationFrame(render);
    if (sceneReady == true) {
        const delta = clock.getDelta();
        sceneObject.rotation.y -= delta;
    }
    renderer.render(scene, camera);
}

render();
onWindowResize();