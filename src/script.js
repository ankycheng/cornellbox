import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let objects = {}

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture
})

// Portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
})

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffe5
})

/**
 * Model
 */
 gltfLoader.load(
    'static.glb',
    (gltf) => {
        scene.add(gltf.scene)
    }
)

gltfLoader.load(
    'pc.glb',
    (gltf) => {
        scene.add(gltf.scene)
        objects.pc = gltf.scene;
        objects.mail = gltf.scene.children.find((c) => {
            return c.name == "MAIL";
        })
    }
)

gltfLoader.load(
    'broom.glb',
    (gltf) => {
        scene.add(gltf.scene)
        objects.broom = gltf.scene;
    }
)

gltfLoader.load(
    'phone.glb',
    (gltf) => {
        scene.add(gltf.scene)
        objects.phone = gltf.scene;
    }
)

gltfLoader.load(
    'refridge.glb',
    (gltf) => {
        scene.add(gltf.scene)
        objects.refridge = gltf.scene;
    }
)

gltfLoader.load(
    'piggy.glb',
    (gltf) => {
        scene.add(gltf.scene);
        objects.piggy = gltf.scene;
        // console.log(gltf.scene)
        objects.coin = gltf.scene.children.find((c) => {
            return c.name == "Coin"
        })
    }
)


gltfLoader.load(
    'god.glb',
    (gltf) => {
        scene.add(gltf.scene)
        objects.god = gltf.scene;
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 1
scene.add(ambientLight);

const pl = new THREE.DirectionalLight(0xFFFFFF, 1, 10, 20);
pl.position.set(3, 8, 8);
scene.add(pl);


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()
let isEventBinded = false;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    if (elapsedTime % 100 == 0) {
        console.log(scene)
    }

    if (Object.keys(objects).length >=8
    ) {
        if(!isEventBinded){
            bindEvents();
            isEventBinded = true;
        }
        // objects.coin.position.y = 0.5 + Math.sin(elapsedTime * 3) * 0.1;
        // objects.god.position.y = Math.sin(elapsedTime * 1) * 0.1;
    }
    // 

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

function bindEvents(){
    let btn1 = document.getElementById("btn1");
    btn1.addEventListener("click", function(){
        console.log('1 clicked')
    })
}

tick()