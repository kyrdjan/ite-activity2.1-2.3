import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";
import * as dat from "https://esm.sh/lil-gui"

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
scene.add(camera)


/**
* Textures
*/
const textureLoader = new THREE.TextureLoader();

const diffuseMap = textureLoader.load('https://res.cloudinary.com/dcr0ilwho/image/upload/v1732717961/gray_rocks_diff_1k_i0xlak.jpg');
const displacementMap = textureLoader.load('https://res.cloudinary.com/dcr0ilwho/image/upload/v1732717961/gray_rocks_disp_1k_dqqefc.png');



// for full screen
window.addEventListener('dblclick', () =>
{
  const fullscreenElement = document.fullscreenElement ||
  document.webkitFullscreenElement
    if(!fullscreenElement)
    {
      if(canvas.requestFullscreen)
      {
        canvas.requestFullscreen()
      }
      else if(canvas.webkitRequestFullscreen)
      {
        canvas.webkitRequestFullscreen()
      }
    }
    else
    {
      if(document.exitFullscreen)
      { 
        document.exitFullscreen()
      }
      else if(document.webkitExitFullscreen)
      {
        document.webkitExitFullscreen()
      }
    }
})

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
* Objects
*/

const groundMaterial = new THREE.MeshStandardMaterial({
  map: diffuseMap,              // Base color
  displacementMap: displacementMap,  // Displacement (height map)
});
for (let x = -1; x <= 1; x++) {
  for (let z = -1; z <= 1; z++) {
    const groundTile = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      groundMaterial
    );
    groundTile.rotation.x = -Math.PI / 2;  // Lay flat
    groundTile.position.set(x * 1.9, 0, z * 1.9);  // Position based on grid
    console.log(groundTile.position.set(x * 1.9, 0, z * 1.9))
    groundTile.castShadow = true;
    groundTile.receiveShadow = true;
    scene.add(groundTile);
  }
}


const basecar = new THREE.Group()


// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });  // Blue body
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });  // Black wheels
const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.7 });  // Transparent glass
const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });  // Yellow headlights
const breaklightMaterial = new THREE.MeshStandardMaterial({ color: 0xfe0000 });  // Red breaklights

// Car Body
const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.6), bodyMaterial);
body.position.y = 0.2;
basecar.add(body);
body.castShadow = true
body.receiveShadow = true

// Roof
const roof = new THREE.Mesh(new THREE.BoxGeometry(0.81, 0.05, 0.52), bodyMaterial);
roof.position.set(-0.1, 0.6, 0);
basecar.add(roof);
roof.castShadow = true
roof.receiveShadow = true

// Cabin
const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.5), glassMaterial);
cabin.position.set(-0.1, 0.45, 0);
basecar.add(cabin);
cabin.castShadow = true
cabin.receiveShadow = true

// Front Grill
const grill = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.4), wheelMaterial);
grill.position.set(0.6, 0.15, 0);
basecar.add(grill);
grill.castShadow = true
grill.receiveShadow = true

// Headlights
const headlightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.1), headlightMaterial);
headlightLeft.position.set(0.6, 0.25, 0.2);
basecar.add(headlightLeft);
headlightLeft.castShadow = true
headlightLeft.receiveShadow = true
// Enable shadow casting
headlightLeft.castShadow = true;
headlightLeft.receiveShadow = true;

const headlightRight = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.1), headlightMaterial);
headlightRight.position.set(0.6, 0.25, -0.2);
basecar.add(headlightRight);
headlightRight.castShadow = true
headlightRight.receiveShadow = true

// Breaklights
const breaklightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.1), breaklightMaterial);
breaklightLeft.position.set(-0.6, 0.25, 0.2);
basecar.add(breaklightLeft);
breaklightLeft.castShadow = true
breaklightLeft.receiveShadow = true
const breaklightRight = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.1), breaklightMaterial);
breaklightRight.position.set(-0.6, 0.25, -0.2);
basecar.add(breaklightRight);
breaklightRight.castShadow = true
breaklightRight.receiveShadow = true

// Wheels
function createWheel() {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16),
    wheelMaterial
  );
}

const frontLeftWheel = createWheel();
frontLeftWheel.position.set(0.4, 0.1, 0.35);
frontLeftWheel.rotation.x = Math.PI / 2;
basecar.add(frontLeftWheel);

const frontRightWheel = createWheel();
frontRightWheel.position.set(0.4, 0.1, -0.35);
frontRightWheel.rotation.x = Math.PI / 2;
basecar.add(frontRightWheel);

const rearLeftWheel = createWheel();
rearLeftWheel.position.set(-0.4, 0.1, 0.35);
rearLeftWheel.rotation.x = Math.PI / 2;
basecar.add(rearLeftWheel);

const rearRightWheel = createWheel();
rearRightWheel.position.set(-0.4, 0.1, -0.35);
rearRightWheel.rotation.x = Math.PI / 2;
basecar.add(rearRightWheel);


//scenes for cars
const maincar = basecar.clone()
maincar.position.y = 1.5
maincar.rotation.z = -0.5
maincar.castShadow = true
scene.add(maincar)

const subcar1 = basecar.clone()
subcar1.position.y = 1
subcar1.rotation.x = -0.5
subcar1.position.z = -1
subcar1.rotation.z = 0.1
subcar1.castShadow = true
scene.add(subcar1)

const subcar2 = basecar.clone()
subcar2.position.y = 1
subcar2.rotation.x = 0.5
subcar2.position.z = 1
subcar2.rotation.z = -0.2
subcar2.castShadow = true
scene.add(subcar2)


const subcar3 = basecar.clone()
subcar3.position.y = 0.45
subcar3.position.z = 2.2
scene.add(subcar3)


const subcar4 = basecar.clone()
subcar4.position.y = 0.45
subcar4.position.z = -2.2
scene.add(subcar4)


///UFOOO


const torus = new THREE.Mesh( new THREE.TorusGeometry( 2, 1.5, 3, 50 ) , new THREE.MeshBasicMaterial( { color: 0x4A5859 } ) ); scene.add( torus );
torus.rotation.x = Math.PI / 2
torus.position.y = 4.5 
torus.castShadow = true
torus.receiveShadow = true


const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32), new THREE.MeshBasicMaterial( { color: 0xffffffff } ) ) 
scene.add(sphere)
sphere.position.y = 5.5
sphere.castShadow = true
sphere.receiveShadow = true


// Effects on lights

let blinkState = false;
setInterval(() => {
  blinkState = !blinkState;

  // Toggle headlights
  if (blinkState) {
    // Turn on the headlights by setting emissive color
    headlightMaterial.emissive = new THREE.Color(0xffff00); // Yellow light (headlights on)
  } else {
    // Turn off the headlights by resetting emissive color
    headlightMaterial.emissive = new THREE.Color(0x000000); // Dark (headlights off)
  }

  // Toggle brake lights
  if (blinkState) {
    // Turn on the brake lights by setting emissive color
    breaklightMaterial.emissive = new THREE.Color(0xfe0000); // Red light (brake lights on)
  } else {
    // Turn off the brake lights by resetting emissive color
    breaklightMaterial.emissive = new THREE.Color(0x000000); // Dark (brake lights off)
  }

}, 500); // 500 milliseconds interval (change as needed)




// Renderer (making the output cater all the window space)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize( window.innerWidth, window.innerHeight );

const controls = new OrbitControls( camera, renderer.domElement );
document.body.appendChild( renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 3, 3, 2 );//--------2----3------------------------------------------------------------------------------
controls.update();


renderer.shadowMap.enabled = true



/**
* Fog
*/
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog
renderer.setClearColor('#262837')


////////////////
window.addEventListener('resize', () =>
{
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
* Lights
*/
const light = new THREE.AmbientLight( 0x404040, 0.6); // soft white light
scene.add( light );
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)

const spotlight = new THREE.SpotLight(0x00ffcc, 1);  // Light color and intensity
spotlight.position.set(0, 4.5, 0);
spotlight.angle = Math.PI / 6;  // Cone angle
spotlight.penumbra = 0.6;
spotlight.decay = 1;  // Decay factor
spotlight.castShadow = true;  // Enable shadow casting

scene.add(spotlight);


spotlight.shadow.mapSize.width = 1024;  // Increase shadow map resolution
spotlight.shadow.mapSize.height = 1024;

// Beam visualization
const beamGeometry = new THREE.ConeGeometry(2, 6, 32);
const beamMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffcc,
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(0, 3.4, 0);  // Beam starts below the spotlight
scene.add(beam);



/*
* Shadow
*/


/**
* Debug
*/
// const gui = new dat.GUI()
// gui.add(--, 'metalness').min(0).max(1).step(0.0001)
// gui.add(--, 'roughness').min(0).max(1).step(0.0001)
// gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)


/*
Helper
*/
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


// Animate
const clock = new THREE.Clock()
const tick = () =>
{   
    //animation codes here

    // Render the scene
    renderer.render(scene, camera)
  

    window.requestAnimationFrame(tick)
}
tick()
