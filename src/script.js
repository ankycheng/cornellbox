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

// typical import
import gsap from "gsap";
import {
    TimelineMax,
    CSSPlugin,
    ScrollToPlugin,
    Draggable
} from "gsap/all";

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
// const bakedTexture = textureLoader.load('baked.jpg')
// bakedTexture.flipY = false
// bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
// const bakedMaterial = new THREE.MeshBasicMaterial({
//     map: bakedTexture
// })

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
        objects.mail.material.transparent = true;
        objects.mail.material.opacity = 0;
        objects.mail.scale.set(0.1, 0.1, 0.1);
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
        objects.coin = gltf.scene.children.find((c) => {
            return c.name == "Coin"
        })
        objects.coin.material.transparent = true;
        objects.coin.material.opacity = 0;
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
let content = ''

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    if (elapsedTime % 100 == 0) {
        console.log(scene)
    }

    if (Object.keys(objects).length >= 8) {
        if (!isEventBinded) {
            bindEvents();
            isEventBinded = true;
        }
        // objects.coin.position.y = 0.5 + Math.sin(elapsedTime * 3) * 0.1;
        objects.god.position.y = Math.sin(elapsedTime * 3) * 0.05;
        objects.god.position.y = Math.sin(elapsedTime * 3) * 0.05;
    }
    // 

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


function bindEvents() {
    let contentEl = document.getElementById("content");
    let btn1 = document.getElementById("btn1");
    btn1.addEventListener("click", function () {
        var tl = new TimelineMax({
            repeat: 5,
            yoyo: true
        });
        tl.to(objects.refridge.position, {
            'y': 0.1,
            duration: 0.3
        })
        content = "<h3>Offering</h3> Oftentimes, the worshippers who placed them on the altar (or on the tables set out during festivals, as shown in the photo on the left) return after praying and take any food items home to eat."
        contentEl.innerHTML = content;
        approachToObject(objects.refridge);
    })

    let btn2 = document.getElementById("btn2");
    btn2.addEventListener("click", function () {
        objects.mail.material.opacity = 1
        let orgY = objects.mail.position.y;

        var tl = new TimelineMax({
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                objects.mail.material.opacity = 0
            }
        });
        tl.to(objects.mail.position, {
            'y': orgY + 0.1,
            duration: 0.3
        })
        content = `<h3>Incense</h3>Incense plays a central role in Taiwanese popular religion, and the smell is omnipresent in halls of worship. In a religious sense, however, the scent is unimportant, as it’s the smoke curling upwards which is believed to convey prayers to heaven.<br><br>

        A couple of Mandarin Chinese terms often heard in connection with temples underscore the importance of incense. One is fenxiang (‘dividing incense’), the name of the ritual by which followers of a god in one particular house of worship take ash of incense sacrificed there and use it to establish an affiliated shrine at another location. Enough should be collected to fill the main censer (pictured lower right). Pilgrims who travel away from home in order to pray and make offerings at a related temple are called xiangke (‘guests bearing incense’).`
        contentEl.innerHTML = content;
        approachToObject(objects.pc);
    })

    let btn3 = document.getElementById("btn3");
    btn3.addEventListener("click", function () {
        let orgY = objects.phone.position.y;
        var tl = new TimelineMax({
            repeat: 5,
            yoyo: true
        });
        tl.to(objects.phone.position, {
            'y': orgY + 0.1,
            duration: 0.3
        })
        content = `<h3>Divination Blocks</h3> Moon blocks or jiaobei, also poe, are wooden divination tools originating from China, which are used in pairs and thrown to seek divine guidance in the form of a yes or no question. They are made out of wood or bamboo and carved into a crescent shape. A pair of clam shells can also be used. Each block is round on one side (known as the yin side) and flat on the other (known as the yang side). It is one of the more commonly used items found in Chinese traditional religion and are used in temples and home shrines along with fortune sticks, both of which are often used together when requesting an answer from the Deities.`
        contentEl.innerHTML = content;
        approachToObject(objects.phone);
    })

    let btn4 = document.getElementById("btn4");
    btn4.addEventListener("click", function () {
        objects.coin.material.opacity = 1
        let orgY = objects.coin.position.y;
        var tl = new TimelineMax({
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                objects.coin.material.opacity = 0
            }
        });
        tl.to(objects.coin.position, {
            'y': orgY + 0.1,
            duration: 0.3
        })
        content = `<h3>Joss Paper Money</h3> Burning joss papers, a special ritual of Han Chinese people in Taiwan, is commonly applied in temple events and festivals when people worship gods and ancestors or pay respect to spirits. The main purpose of burning joss papers is to communicate with the gods world or the spirits world. In Taiwan alone, temples receive about 400 million U.S. dollars from the sale of Joss Paper!`
        contentEl.innerHTML = content;
        approachToObject(objects.piggy);
    })

    let btn5 = document.getElementById("btn5");
    btn5.addEventListener("click", function () {
        var tl = new TimelineMax({
            repeat: 5,
            yoyo: true
        });
        tl.to(objects.broom.rotation, {
            'y': -0.1,
            'x': 0.1,
            'z': 0.1,
            duration: 0.3
        })

        content = `<h3>Exorcism</h3> One of more interesting duties for the helpers is for a ritual called "recalling frightening souls" (收驚) which is an age-old Taoist ritual meant to help purify oneself and bring calm to your soul. The thought process behind it is that from time to time, something might happen which frightens you so much that your soul (one of them) attempts to 'escape' from your body. It could be anything from a good scare during a horror movie to a close call on the road. If you feel yourself suffering from this sort of shock, it is quite normal for people to visit a temple to have this ritual performed on them and Xingtian temple is the primary destination for the people of Taipei to have this sort of spiritual therapy done. <br><br>

        The ritual which is a 'cleansing' or even an 'exorcism' of sorts is meant to calm your soul and bring it back into your body so that you are more at ease. The women who perform the ritual at this specific temple will wave a stick of incense around all of your chakra points and whisper a prayer signifying that it is safe for your soul to return to your body.
        <a target="_blank" href="https://www.goteamjosh.com/blog/xingtian">https://www.goteamjosh.com/blog/xingtian</a>
        `
        contentEl.innerHTML = content;
        approachToObject(objects.broom);
    })
}

let firstmove = true

function approachToObject(target) {
    var dir = new THREE.Vector3(); // create once an reuse it
    let currentPosition
    
    if(firstmove){
        currentPosition = objects.god.children[0].position
        dir.subVectors(target.children[0].position, currentPosition).normalize();
        firstmove = false

    }else{
        currentPosition = objects.god.currentPosition
        dir.subVectors(target.children[0].position, currentPosition).normalize();
    }
    
    objects.god.currentPosition = target.children[0].position

    console.log(objects.god.children[0].position.distanceTo(target.children[0].position))
    
    // objects.god.currentPosition = target.position
    
    var i = 1;
    let steps = 50;

    var handle = setInterval(function () {
        // x.value = (i * 2) + "seconds";
        objects.god.position.x += dir.x/steps;
        objects.god.position.y += dir.y/steps;
        objects.god.position.z += dir.z/steps;

        i++;
        if (i > steps) clearInterval(handle);

    }, 20);


}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-7vG62rVM8RThMNCDmU2JgX-gr7bRGPc",
  authDomain: "cornell-box-deitys-office.firebaseapp.com",
  projectId: "cornell-box-deitys-office",
  storageBucket: "cornell-box-deitys-office.appspot.com",
  messagingSenderId: "478439101966",
  appId: "1:478439101966:web:85ab93f2c6952827028e5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

tick()