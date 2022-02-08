import * as THREE from "https://unpkg.com/three@0.137.5/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js?module";
import * as dat from "/node_modules/dat.gui/build/dat.gui.module.js";



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
camera.lookAt(0, 0, 0);


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

let n = 0;

// Vector List //
let activeVectors = [];

function showVector() {

    var i = document.getElementById("vector-1_i");
    var j = document.getElementById("vector-1_j");
    var k = document.getElementById("vector-1_k");
    
    let iComponent = i.value;
    let jComponent = j.value;
    let kComponent = k.value;
    
    iComponent = parseFloat(iComponent);
    jComponent = parseFloat(jComponent);
    kComponent = parseFloat(kComponent);
    
    if (iComponent !== NaN && jComponent != NaN && kComponent != NaN) {               

        // Line Vectors
    
        const vPoints_1 = [];
        vPoints_1.push(new THREE.Vector3(0, 0, 0));
        vPoints_1.push(new THREE.Vector3(iComponent, jComponent, kComponent));
    
        
        const v1_geometry = new THREE.BufferGeometry().setFromPoints(vPoints_1);
        const v1_material = new THREE.LineBasicMaterial({color: 0x4AC5FF});
        
        const vectorOne = new THREE.Line(v1_geometry, v1_material);
        scene.add(vectorOne);
        n++

        
        
        
        // TODO - REMOVING VECTORS //    
        
        // ArrowHelper Vectors
        /*
        const origin = new THREE.Vector3(0,0,0);
        const direction = new THREE.Vector3(iComponent_1, jComponent_1, kComponent_1);
        direction.normalize();
        
        const length = Math.sqrt((Math.pow(iComponent_1, 2)) + (Math.pow(jComponent_1, 2) + (Math.pow(kComponent_1, 2))));
        const colour = 0x4AC5FF
        const vectorOne = new THREE.ArrowHelper(direction, origin, length, colour);
        scene.add(vectorOne);
        */
    }
    
    else { 
    }        
    
    
    let vectorObj = {
        name: `Vector ${n}`,
        value: `vector-${n}`,
        coords: `(${iComponent}, ${jComponent}, ${kComponent})`
    };
    
    activeVectors.push(vectorObj)
    
    console.warn("added ", {vectorObj});
    console.log(activeVectors);
    
    
    
    // -- ACTIVE VECTOR LIST -- //
    
    // Parent Vector List
    const vectorList = document.getElementById("vector-list");
    
    // Create a new list item (e.g: Vector 1: (5, 4, 3))
    let vectorItem = document.createElement("li");
    vectorItem.textContent = (`${vectorObj["name"]}: ${vectorObj["coords"]}`);
    
    vectorList.appendChild(vectorItem);
    
    // Matrix Vector Select
    
    var vectorOpt = document.createElement("option");
    vectorOpt.text = vectorObj["name"];
    vectorOpt.value = `vector-${n}`;
    var matrixSelect = document.getElementById("vector-select");
    
    matrixSelect.appendChild(vectorOpt);

    var selectedVector_Matrix;
    var currVector = [];
    matrixSelect.addEventListener("change", () => {
        console.log(matrixSelect.value);
        selectedVector_Matrix = matrixSelect.value;
        console.log("Currently selected vector: ", selectedVector_Matrix);
        

        // CHECK FOR CORRESPONDING VECTOR OBJECT
    
        for (var i = 0; i < activeVectors.length; i++) {
            if (activeVectors[i]["value"] == selectedVector_Matrix) {
                console.log(activeVectors[i]);
                if (currVector.length > 0) {
                    currVector = [];
                }
                else {

                }
                currVector.push(activeVectors[i]);
                break;
                // console.log("selected vector: ", selectedVector_Matrix);
                // console.log("same value = TRUE");
            }
            else {
                continue;
            }    
        }
    // Current Vector in Matrix Selection Box
    console.log("currVector", currVector);
    var tempList = [];
    var columnVector = [];


    console.log(currVector[0]["coords"]);
    
    let x = currVector[0]["coords"];

    /* FINISH -
        Double-digit numbers are interpreted as two separate values
        e.g 12 => [1], [2]
    */

    for (let i = 0; i < x.length; i++) {
        if (isNaN(parseFloat(x[i])) == true) {

        }
        else {
            tempList.push([parseFloat(x[i])])

        }
    }
    console.log(tempList);

    // console.log(columnVector);

    // Matrix Calculations //
    let matrixA = document.getElementById("matrix-a");
    let matrixB = document.getElementById("matrix-b");
    let matrixC = document.getElementById("matrix-c");

    let matrixD = document.getElementById("matrix-d");
    let matrixE = document.getElementById("matrix-e");
    let matrixF = document.getElementById("matrix-f");

    let matrixG = document.getElementById("matrix-g");
    let matrixH = document.getElementById("matrix-h");
    let matrixI = document.getElementById("matrix-i");

})
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


// Controls

const controls = new OrbitControls(camera, renderer.domElement);

// | GUI | //

const cameraPosition = gui.addFolder("CameraPosition")
const cameraRotation = gui.addFolder("CameraRotation")


// _position_ //
cameraPosition.add(camera.position, "x").min(-10).max(10).step(0.01)
cameraPosition.add(camera.position, "y").min(-5).max(10).step(0.01)
cameraPosition.add(camera.position, "z").min(-30).max(30).step(0.01)
// _rotation_ //
cameraRotation.add(camera.rotation, "x").min(-10).max(10).step(0.0001)
cameraRotation.add(camera.rotation, "y").min(-5).max(10).step(0.0001)
cameraRotation.add(camera.rotation, "z").min(-30).max(30).step(0.0001)



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