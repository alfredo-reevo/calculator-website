//import * as THREE from "/Code/calculator-website/build/three.module.js"
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js"
import * as dat from "/node_modules/dat.gui/build/dat.gui.module.js"

// Appearance Related //

// - Vector/Matrix Tabs - //
const tabs = document.querySelectorAll("[data-tab-target]")
const tabContents = document.querySelectorAll("[data-tab-content]")

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => tabContent.classList.remove("active"))
        target.classList.add("active")
    })
})



// GUI
const gui = new dat.GUI()

// Canvas 
const canvas = document.querySelector("#canv");

// -- Scene -- //
const scene = new THREE.Scene();

// -- Camera -- // 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// -- Renderer -- //
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);
camera.position.set(0, 5, 20);

renderer.render(scene, camera);

// - Geometry - //

// DEFINING VECTORS //

// - Vector 1 - //

let calcBtn = document.getElementById("v1-button")

calcBtn.addEventListener("click", showVector);

function showVector() {
    var i_1 = document.getElementById("vector-1_i");
    var j_1 = document.getElementById("vector-1_j");
    var k_1 = document.getElementById("vector-1_k");
    
    let iComponent_1 = i_1.value;
    let jComponent_1 = j_1.value;
    let kComponent_1 = k_1.value;
    
    iComponent_1 = parseFloat(iComponent_1);
    jComponent_1 = parseFloat(jComponent_1);
    kComponent_1 = parseFloat(kComponent_1);
    
    if (iComponent_1 !== NaN && jComponent_1 != NaN && kComponent_1 != NaN) {
        
        /*
        const vPoints_1 = [];
        vPoints_1.push(new THREE.Vector3(0, 0, 0));
        vPoints_1.push(new THREE.Vector3(iComponent_1, jComponent_1, kComponent_1));
    
        
        const v1_geometry = new THREE.BufferGeometry().setFromPoints(vPoints_1);
        const v1_material = new THREE.LineBasicMaterial({color: 0x4AC5FF, linecap: "round"});
        
        const vectorOne = new THREE.Line(v1_geometry, v1_material);
        scene.add(vectorOne)
        */

        const origin = new THREE.Vector3(0,0,0);
        const direction = new THREE.Vector3(iComponent_1, jComponent_1, kComponent_1);
        direction.normalize();

        const length = Math.sqrt((Math.pow(iComponent_1, 2)) + (Math.pow(jComponent_1, 2) + (Math.pow(kComponent_1, 2))));
        const colour = 0x4AC5FF
        const vectorOne = new THREE.ArrowHelper(direction, origin, length, colour);
        scene.add(vectorOne);
    }

    else {
        
    }
}


// -- Grid Plane -- //

var size = 30;
var step = 30;

const grid = new THREE.GridHelper(size, step);
scene.add(grid);

// - Axes - //

// # Y Axis # //
const yPoints = []
yPoints.push(new THREE.Vector3(0,0,0));
yPoints.push(new THREE.Vector3(0,(size/2),0));
yPoints.push(new THREE.Vector3(0,-(size/2),0));
const yAxis_geo = new THREE.BufferGeometry().setFromPoints(yPoints);
const yAxis_mat = new THREE.LineBasicMaterial({color: 0xffffff});

const yAxis = new THREE.Line(yAxis_geo, yAxis_mat);
scene.add(yAxis)

// # X Axis # //
const xPoints = []
xPoints.push(new THREE.Vector3(-(size/2),0,0));
xPoints.push(new THREE.Vector3((size/2), 0 ,0));
const xAxis_geo = new THREE.BufferGeometry().setFromPoints(xPoints);
const xAxis_mat = new THREE.LineBasicMaterial({color: 0xffffff});

const xAxis = new THREE.Line(xAxis_geo, xAxis_mat);
scene.add(xAxis)

// # Z Axis # // 
const zPoints = []
zPoints.push(new THREE.Vector3(0,0,-(size/2)));
zPoints.push(new THREE.Vector3(0, 0, (size/2)));
const zAxis_geo = new THREE.BufferGeometry().setFromPoints(zPoints);
const zAxis_mat = new THREE.LineBasicMaterial({color: 0xffffff});

const zAxis = new THREE.Line(zAxis_geo, zAxis_mat);
scene.add(zAxis)



// | GUI | //

const CameraPosition = gui.addFolder("CameraPosition")
const CameraRotation = gui.addFolder("CameraRotation")

// _position_ //
CameraPosition.add(camera.position, "x").min(-10).max(10).step(0.01)
CameraPosition.add(camera.position, "y").min(-5).max(10).step(0.01)
CameraPosition.add(camera.position, "z").min(-30).max(30).step(0.01)
// _rotation_ //
CameraRotation.add(camera.rotation, "x").min(-10).max(10).step(0.0001)
CameraRotation.add(camera.rotation, "y").min(-5).max(10).step(0.0001)
CameraRotation.add(camera.rotation, "z").min(-30).max(30).step(0.0001)

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})




// Update
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
}


animate()