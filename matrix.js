// import * as THREE from "https://unpkg.com/three@0.137.5/build/three.module.js";
// import { OrbitControls } from "https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js?module";
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
// import * as dat from "/node_modules/dat.gui/build/dat.gui.module.js";



// Appearance Related //

// - Vector/Matrix Tabs - //
const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => tabContent.classList.remove("active"));
        target.classList.add("active");
    });
});


// GUI
// const gui = new dat.GUI();

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

let calcBtn = document.getElementById("v1-button");

calcBtn.addEventListener("click", vectorCreate);

let n = 0;

// Vector List //

var activeVectors = [];
function vectorCreate() {
        
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
        
            const vPoints = [];
            vPoints.push(new THREE.Vector3(0, 0, 0));
            vPoints.push(new THREE.Vector3(iComponent, jComponent, kComponent));
        
            
            const vectorGeometry = new THREE.BufferGeometry().setFromPoints(vPoints);
            const vectorMaterial = new THREE.LineBasicMaterial({color: 0x4AC5FF});
            
            var vector = new THREE.Line(vectorGeometry, vectorMaterial);
            scene.add(vector);
            n++;
            
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
        };      
        
        
        let vectorObj = {
            name: `Vector ${n}`,
            value: `vector-${n}`,
            coords: `(${iComponent}, ${jComponent}, ${kComponent})`,
            x: parseFloat(iComponent),
            y: parseFloat(jComponent),
            z: parseFloat(kComponent)
        };
        
        activeVectors.push(vectorObj);
        
        
        console.warn("added ", {vectorObj});
        console.log("Active Vectors: ", activeVectors);
        
        
        
        // -- ACTIVE VECTOR LIST -- //
        
        // Parent Vector List
        const vectorList = document.getElementById("vector-list");
        var removeVector = document.getElementById("remove-vector");
        
        // Create a new list item (e.g: Vector 1: (5, 4, 3))
        let vectorItem = document.createElement("li");
        let vectorSelect = document.createElement("option");
        vectorItem.textContent = (`${vectorObj["name"]}: ${vectorObj["coords"]}`);
        
        vectorSelect.text = vectorObj["name"];
        vectorSelect.value = `vector-${n}`;


        vectorList.appendChild(vectorItem);
        removeVector.appendChild(vectorSelect);


        // Matrix Vector Select
        
        let vectorOpt = document.createElement("option");
        vectorOpt.text = vectorObj["name"];
        vectorOpt.value = `vector-${n}`;
        
        let matrixSelect = document.getElementById("vector-select");
        
        matrixSelect.appendChild(vectorOpt);

}
    /*
        let removeButton = document.getElementById("remVector");
        removeButton.addEventListener("click", () => {
            var removeVector = document.getElementById("remove-vector");
            let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === removeVector.value)
            console.log("current vector in vectorRem: ", currVector)
            
            const object = scene.getObjectByProperty(removeVector.textContent);

            object.geometry.dispose();
            object.material.dispose();
            scene.remove( object );
        })
    */

    // Matrix Transformations

        let transformation = false;

        let matrixSelect = document.getElementById("vector-select");
        let applyBtn = document.getElementById("apply-matrix-btn");
        var columnVector = [];
        
        applyBtn.addEventListener("click", () => {            
            //activeVectors = [];
            columnVector = [];
                    
            let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === matrixSelect.value)
                // Current Vector in Matrix Selection Box
            console.log("Current Vector: ", currVector[0]);
            console.log("Active Vectors: ", activeVectors);
                    
                        
            /* The array columnVector holds the x, y and z coordinates of a vector in a 2D array, 
                which emulates a 3x1 matrix
                */
            columnVector.push([currVector[0]["x"]]);
            columnVector.push([currVector[0]["y"]]);
            columnVector.push([currVector[0]["z"]]);
                        
            console.log("columnVector: ", columnVector);
                    
                // Matrix Calculations //
            let matrixA = document.getElementById("matrix-a");
            let valA = parseFloat(matrixA.value)
            let matrixB = document.getElementById("matrix-b");
            let valB = parseFloat(matrixB.value)
            let matrixC = document.getElementById("matrix-c");
            let valC = parseFloat(matrixC.value)
                
            let matrixD = document.getElementById("matrix-d");
            let valD = parseFloat(matrixD.value)
            let matrixE = document.getElementById("matrix-e");
            let valE = parseFloat(matrixE.value)
            let matrixF = document.getElementById("matrix-f");
            let valF = parseFloat(matrixF.value)
                
            let matrixG = document.getElementById("matrix-g");
            let valG = parseFloat(matrixG.value)
            let matrixH = document.getElementById("matrix-h");
            let valH = parseFloat(matrixH.value)
            let matrixI = document.getElementById("matrix-i");
            let valI = parseFloat(matrixI.value)
                
            let transformCoords = [];
                
            let transX = 0;
            let transY = 0;
            let transZ = 0;
                
            transX = ((valA * columnVector[0][0]) + (valB * columnVector[1][0]) + (valC * columnVector[2][0]));
            transY = ((valD * columnVector[0][0]) + (valE * columnVector[1][0]) + (valF * columnVector[2][0]));
            transZ = ((valG * columnVector[0][0]) + (valH * columnVector[1][0]) + (valI * columnVector[2][0]));
                    
                    
            transformCoords.push(new THREE.Vector3(0, 0, 0));
            transformCoords.push(new THREE.Vector3(transX, transY, transZ));            
                    
            transformation = true;
                    
            if (transformation == true) {
                const transGeometry = new THREE.BufferGeometry().setFromPoints(transformCoords);
                const transMaterial = new THREE.LineBasicMaterial({color: 0xFF8B00});
                
                var transVector = new THREE.Line(transGeometry, transMaterial);
                scene.add(transVector);
                
                // Create a new list item for transformed vector (e.g: Vector 1 (Transform): (5, 4, 3))
                const vectorList = document.getElementById("vector-list");
                let transAppend = document.createElement("li");
                transAppend.textContent = (`${currVector[0]["name"]} (Transform): (${transX}, ${transY}, ${transZ})`);
                
                let tVectorObj = {
                    name: `${currVector[0]["name"]} (Transform)`,
                    value: `${currVector[0]["value"]}-transform`,
                    coords: `(${transX}, ${transY}, ${transZ})`,
                    x: parseFloat(transX),
                    y: parseFloat(transY),
                    z: parseFloat(transZ)
                };
            
                activeVectors.push(tVectorObj);
            
                vectorList.appendChild(transAppend);
            
                transformation = false;
            };
        });

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
/*
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
*/


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