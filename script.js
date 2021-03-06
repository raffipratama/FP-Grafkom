import * as THREE from './js/three.module.js';
import {
    GLTFLoader
} from './js/GLTFLoader.js';


var skor = 0;
const clock = new THREE.Clock();
let mixer;
let spheres = [];
// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
camera.position.y = 25;
camera.rotation.x = THREE.Math.degToRad(-30);
camera.position.z = 60;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;

// Panorama
const panorama = new THREE.CubeTextureLoader();
const textureSun = panorama.load([
    'panorama/px.png',
    'panorama/nx.png',
    'panorama/py.png',
    'panorama/ny.png',
    'panorama/pz.png',
    'panorama/nz.png'
]);
scene.background = textureSun;

//audio
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'audio.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

// Road
let video01 = document.getElementById('video01');
video01.playbackRate = 5;
video01.play();
let videoTexture01 = new THREE.VideoTexture(video01);
let roadPlane = new THREE.BoxGeometry(40, 100);
let roadMaterial = new THREE.MeshLambertMaterial({
    map: videoTexture01
});

let plane = new THREE.Mesh(roadPlane, roadMaterial);
plane.rotation.x = THREE.Math.degToRad(270);
plane.receiveShadow = true;
scene.add(plane);


// Model
var model
const loader = new GLTFLoader();
loader.load(
    'scene.gltf',
    (gltf) => {
        model = gltf.scene;
        model.scale.set(16, 16, 16);
        model.position.z = 40;
        model.rotation.y = THREE.Math.degToRad(180);
        mixer = new THREE.AnimationMixer(model);
        mixer.timeScale = 1.5;
        var action = mixer.clipAction(gltf.animations[0]);
        action.play();
        scene.add(model);
    }
);

//jump audio
const listener2 = new THREE.AudioListener();
camera.add( listener2 );
const sound2 = new THREE.Audio( listener2 );
// const audioLoader2 = new THREE.AudioLoader();
audioLoader.load( 'Jump Sound Effect.mp3', function( buffer ) {
	sound2.setBuffer( buffer );
	sound2.setLoop( false );
	sound2.setVolume( 0.5 );
});

//slide audio
const listener3 = new THREE.AudioListener();
camera.add( listener3 );
const sound3 = new THREE.Audio( listener3 );
// const audioLoader3 = new THREE.AudioLoader();
audioLoader.load( 'Slide Sound Effect.mp3', function( buffer ) {
	sound3.setBuffer( buffer );
	sound3.setLoop( false );
	sound3.setVolume( 0.5 );
});



document.addEventListener("keydown", onDocumentKeyDown, false);
let speedX = 1.6;
let gravity = 0.4;
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var posx = model.position.x;
    var posy = model.position.y;
    // up / space
    if (keyCode == 38 || keyCode == 32) {
        var speedY = 3;
        let allowUp = true;
        let allowDown = true;
        sound2.play();
        // console.log('masuk up/space');
        renderer.setAnimationLoop(() => {
            if (speedY > 0 && allowUp && posy==0) {
                model.position.y += speedY
                speedY -= gravity;
                if (speedY <= 0) {
                    speedY = 0;
                    allowUp = false;
                    allowDown = true;
                }
            }
            else if (allowDown) {
                model.position.y -= speedY
                speedY += gravity;

                if (model.position.y < 0) {
                    model.position.y = 0;
                    allowUp = false;
                    allowDown = false;
                }
            }
            // console.log(`${model.position.y}, ${speedY}`);
        });
    }
    //left
    if (keyCode == 37 && model.position.x != -15 && model.position.y == 0) {
        sound3.play();
        renderer.setAnimationLoop(() => {
            if (posx <= 0) {
                if (model.position.x > -14)
                    model.position.x -= speedX;
            } else if (posx <= 15) {
                if (model.position.x > 0)
                    model.position.x -= speedX;
                if (model.position.x < 0)
                    model.position.x = 0;
            }
        });
    }

    // right 
    if (keyCode == 39 && model.position.x != 15 && model.position.y == 0) {
        sound3.play();
        renderer.setAnimationLoop(() => {
            if (posx >= 0) {
                if (model.position.x < 14)
                    model.position.x += speedX;
            } else if (posx >= -15) {
                if (model.position.x < 0)
                    model.position.x += speedX;
                if (model.position.x > 0)
                    model.position.x = 0;
            }
        });
    }
};

// Lights
const Light = new THREE.AmbientLight(0xffffff);
Light.position.set(0, 10, 30);
Light.intensity = 0.5;
scene.add(Light);

// Fog
scene.fog = new THREE.Fog('black', 60, 100);



var arr = ["-15", "0", "15"];
var sphere;
//sphere

setInterval(function () {

    const texture = new THREE.TextureLoader().load('16079.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    sphere = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 20), material);
    sphere.name = sphere;
    scene.add(sphere);
    sphere.position.z = -20;
    sphere.position.y = 5;
    sphere.position.x = arr[Math.floor(Math.random() * arr.length)];
    sphere.castShadow = true;

    spheres.push(sphere);
}, 2000);

var started=0, finished=0, person;

// Animation
function animate() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (!started){
        person = prompt("Please enter your name");
        started ++;
    }

    spheres.forEach((sphere) => {
        sphere.rotation.x += THREE.Math.degToRad(10);
        sphere.position.z += 2;
        setTimeout(function () {
            scene.remove(sphere);
        }, 2000);
    });
    let mpos = model.position;
    let spos = sphere.position;
    
    if (((mpos.x - spos.x) <= 4 && (mpos.x - spos.x) >= -4) && ((mpos.z - spos.z) <= 4 && (mpos.z - spos.z) >= -4) && ((mpos.y - spos.y) <= 3 && (mpos.y - spos.y) >= -5) && !finished) {
        alert('Game Over!!\n'+person+' Score : '+skor);
        finished++;
        location.reload();
    }
    else if (mpos.z == spos.z)
    {
        skor++;
        document.getElementById("skor").innerHTML = skor;
    }

}
animate();


