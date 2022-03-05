// import * as THREE from "https://unpkg.com/three@0.137.5/build/three.module.js";
// import { OrbitControls } from "https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js?module";
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
// import * as dat from "/node_modules/dat.gui/build/dat.gui.module.js";


// Classes (ADDED AFTER VECTORS WERE FIRST INTRODUCED)

class PointOBJ {
    constructor(name, value, type, geo, mat, mesh, x, y, z) {
        this.x = x
        this.y = y
        this.z = z
        this.name = name
        this.value = value
        this.type = type
        this.geo = geo
        this.mat = mat
        this.mesh = mesh
    }
}

class PlaneOBJ {
    constructor(name, value, type, geo, mat, mesh, a, b, c, d, normal) {
        this.a = a
        this.b = b
        this.c = c
        this.d = d
        this.name = name
        this.value = value
        this.type = type
        this.geo = geo
        this.mat = mat
        this.mesh = mesh
        this.normal = normal
    }
}

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

// DEFINING VECTORS & POINTS //

// - Planes - //

let planeBtn = document.getElementById("plane-button");
planeBtn.addEventListener("click", planeCreate);

let planeN = 0;

var activePlanes = [];
function planeCreate() {
    var a = document.getElementById("plane-a").value;
    var b = document.getElementById("plane-b").value;
    var c = document.getElementById("plane-c").value;
    var d = document.getElementById("plane-d").value;

    var planeGeometry;
    var planeMaterial;
    var plane;

    var normalVector;

    if (a != NaN && b != NaN && c != NaN && d != NaN) {
        var planeColour = new THREE.Color(0x00FF78);
        planeGeometry = new THREE.BufferGeometry(30, 30);
        planeMaterial = new THREE.MeshBasicMaterial({color: planeColour, 
        side: THREE.DoubleSide});
        plane = new THREE.Mesh(planeGeometry, planeMaterial)

        let normalMagnitude = Math.sqrt(Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2));

        let unitX = (a/normalMagnitude);
        let unitY = (b/normalMagnitude);
        let unitZ = (c/normalMagnitude);

        let unitNormal = new THREE.Vector3(unitX, unitY, unitZ);
        
        // Find the distance between the plane and the origin
        var planeDistance = ((Math.abs(-d))/normalMagnitude)
        console.log("Distance from origin to plane: ", planeDistance)


        // * PLANE METHODS * -- Both use Hessian Normal Form, I've elected to use my manual method. //

        // Plane Helper Method 
        
        /*
        let constant = (d/normalMagnitude);
        var planeHessian = new THREE.Plane(unitNormal, -constant)
        let planeHelper = new THREE.PlaneHelper(planeHessian, 30, 0xFFFFFF)

        scene.add(planeHelper);
        */

        
        // Manual Method 
        
        var scalar = (planeDistance/normalMagnitude);
        console.log("Scalar: ", scalar);

        var scaledNormal_x = (scalar * a);
        var scaledNormal_y = (scalar * b);
        var scaledNormal_z = (scalar * c);

        console.log("Scaled normal: ", `(${scaledNormal_x}, ${scaledNormal_y}, ${scaledNormal_z})`)
        

        let normalPoints = [];
        normalPoints.push(new THREE.Vector3(scaledNormal_x, scaledNormal_y, scaledNormal_z));
        normalPoints.push(new THREE.Vector3(a, b, c));
        
        let normalVectorGeometry = new THREE.BufferGeometry().setFromPoints(normalPoints);
        let normalVectorMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        normalVector = new THREE.Line(normalVectorGeometry, normalVectorMaterial);
        
        
        // console.log("Angle of normal = ", normalAngleX, normalAngleY, normalAngleZ);


        scene.add(normalVector);

        let constant = (d/normalMagnitude);

        let scale = -(constant);

        if (Math.abs(scale) < 1e-8) {
            scale = 1e-8
        }

        plane.scale.set(0.5 * 30, 0.5 * 30, scale);
        const planePositions = [ -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1 ];

        planeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(planePositions, 3));
        planeGeometry.computeBoundingSphere();
        plane.lookAt(unitNormal);

        plane.updateMatrixWorld();

        plane.material.transparent = true;
        plane.material.opacity = 0.5;
        scene.add(plane);
        planeN++;
    }

    var newPlane = new PlaneOBJ(`Plane ${planeN}`, `plane-${planeN}`,
    "plane", planeGeometry, planeMaterial, plane, a, b, c, d, normalVector)

    activePlanes.push(newPlane);

    // Add to Active Objects
    const planeList = document.getElementById("vector-list");
    const removePlane = document.getElementById("remove-vector");

    let planeItem = document.createElement("li");
    let planeSelect = document.createElement("option");

    if (a < 0) {
        var aString = `-${a * -1}`;
    } else {
        var aString = `${a}`
    }
    
    if (b < 0) {
        var bString = `- ${b * -1}`;
    } else {
        var bString = `+ ${b}`
    }

    if (c < 0) {
        var cString = `- ${c * -1}`;
    } else {
        var cString = `+ ${c}`;
    }

    planeItem.textContent = (`${newPlane.name}: ${aString}x ${bString}y ${cString}z = ${d}`);
    planeItem.id = newPlane.value;

    planeSelect.text = newPlane.type;
    planeSelect.value = newPlane.value;
    planeSelect.label = newPlane.name;

    planeList.appendChild(planeItem);
    removePlane.appendChild(planeSelect);
    
}

// - Points - //

let pointBtn = document.getElementById("point-button");
pointBtn.addEventListener("click", pointCreate);

let pointN = 0;

var activePoints = [];
function pointCreate() {
    var x = document.getElementById("point-x").value;
    var y = document.getElementById("point-y").value;
    var z = document.getElementById("point-z").value;

    var pointGeometry;
    var pointMaterial;
    var point;

    if (x != NaN && y != NaN && z != NaN) {
        
        // Rendering of Points // 
        var pointColour = new THREE.Color(0x49FF00)
        pointGeometry = new THREE.SphereGeometry(0.125, 16, 12);

        pointMaterial = new THREE.MeshBasicMaterial({color: pointColour} );
        
        point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x,y,z);
        scene.add(point)
        pointN++
    }

    var newPoint = new PointOBJ(`Point ${pointN}`, `point-${pointN}`,
    "point", pointGeometry, pointMaterial, point, x, y, z)

    activePoints.push(newPoint);

    // Add to Active Objects
    const pointList = document.getElementById("vector-list");
    const removePoint = document.getElementById("remove-vector");

    let pointItem = document.createElement("li");
    let pointSelect = document.createElement("option");
    pointItem.textContent = (`${newPoint.name}: (${x}, ${y}, ${z})`);
    pointItem.id = newPoint.value;

    pointSelect.text = newPoint.type;
    pointSelect.value = newPoint.value;
    pointSelect.label = newPoint.name;

    pointList.appendChild(pointItem);
    removePoint.appendChild(pointSelect);
}

// - Vectors - //

let vecBtn = document.getElementById("v-button");

vecBtn.addEventListener("click", vectorCreate);

let vectorN = 0;

// Vector List //

var activeVectors = [];
function vectorCreate() {
        
        var i = document.getElementById("vector_i");
        var j = document.getElementById("vector_j");
        var k = document.getElementById("vector_k");
        
        let iComponent = i.value;
        let jComponent = j.value;
        let kComponent = k.value;
        
        iComponent = parseFloat(iComponent);
        jComponent = parseFloat(jComponent);
        kComponent = parseFloat(kComponent);
        
        var vectorGeometry;
        var vectorMaterial;
        var vector;

        if (iComponent !== NaN && jComponent != NaN && kComponent != NaN) {               

            // Line Vectors
        
            const vPoints = [];
            vPoints.push(new THREE.Vector3(0, 0, 0));
            vPoints.push(new THREE.Vector3(iComponent, jComponent, kComponent));
        
            
            vectorGeometry = new THREE.BufferGeometry().setFromPoints(vPoints);
            vectorMaterial = new THREE.LineBasicMaterial({color: 0x4AC5FF});
            
            vector = new THREE.Line(vectorGeometry, vectorMaterial);        

            scene.add(vector);
            vectorN++;
            
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
            
        
        let vectorObj = {
            name: `Vector ${vectorN}`,
            value: `vector-${vectorN}`,
            coords: `(${iComponent}, ${jComponent}, ${kComponent})`,
            type: "vector",
            geo: vectorGeometry,
            mat: vectorMaterial,
            mesh: vector,
            index: vectorN,
            x: parseFloat(iComponent),
            y: parseFloat(jComponent),
            z: parseFloat(kComponent)
        };
        
        activeVectors.push(vectorObj);      
        
        // -- ACTIVE VECTOR LIST -- //
        
        // Parent Vector List
        const vectorList = document.getElementById("vector-list");
        var removeVector = document.getElementById("remove-vector");
        
        // Create a new list item (e.g: Vector 1: (5, 4, 3))
        let vectorItem = document.createElement("li");
        let vectorSelect = document.createElement("option");
        vectorItem.textContent = (`${vectorObj["name"]}: ${vectorObj["coords"]}`);
        vectorItem.id = `vector-${vectorN}`;
        console.log(vectorItem);

        vectorSelect.text = "vector";
        vectorSelect.value = `vector-${vectorN}`;
        vectorSelect.label = vectorObj["name"]
        


        vectorList.appendChild(vectorItem);
        removeVector.appendChild(vectorSelect);


        // Matrix Vector Select
        
        let vectorOpt = document.createElement("option");
        vectorOpt.text = vectorObj["name"];
        vectorOpt.value = `vector-${vectorN}`;
        
        let matrixSelect = document.getElementById("vector-select");
        
        matrixSelect.appendChild(vectorOpt);



}

        // REMOVAL OF OBJECTS //

        let removeButton = document.getElementById("remVector");
        removeButton.addEventListener("click", () => {        
            
            var removeItem = document.getElementById("remove-vector");
            
            let item = removeItem.options[removeItem.selectedIndex];
            console.log("Item: ", item);
        
            if (item.text == "vector") {
        
                let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === removeItem.value)
                console.log("current vector to remove: ", currVector)
                
                let currGeometry = currVector[0]["geo"];
                let currMaterial = currVector[0]["mat"];
                let currMesh = currVector[0]["mesh"];

                console.log("currGeometry: ", currGeometry);
                console.log("currMaterial: ", currMaterial)
                console.log("currMesh: ", currMesh)

                currGeometry.dispose();
                console.log("Geometry: ", currGeometry, "disposed!")
                currMaterial.dispose();
                console.log("Material: ", currMaterial, "disposed!")
                scene.remove( currMesh );
                console.log("Mesh: ", currMesh, "deleted!")
                
                
                // Remove from matrix selection
                matrixRemove();
                
                // Remove from vector selection
                listRemove();
                
                // Remove from remove options
                selectRemove();
                
                console.warn("-- UPDATING ACTIVEVECTORS ARRAY --")
                console.log("value: ", currVector[0].value);
                
                activeVectors = activeVectors.filter(vectorObj => vectorObj["value"] != currVector[0].value)
                console.log("updated activeVectors: ", activeVectors);
                
                
                // currVector = [];
            }
            else if (item.text == "point") {
                let currPoint = activePoints.filter(newPoint => newPoint.value === removeItem.value);

                console.log(currPoint);
                /*
                console.log("geometry: ", currPoint[0].geo)
                console.log("material: ", currPoint[0].mat)
                console.log("mesh: ", currPoint[0].mesh)
                */

                let currGeometry = currPoint[0].geo;
                let currMaterial = currPoint[0].mat;
                let currMesh = currPoint[0].mesh;

                currGeometry.dispose();
                currMaterial.dispose();
                scene.remove(currMesh);

                listRemove();

                selectRemove();
            }
        
            else if (item.text == "plane") {
                let currPlane = activePlanes.filter(newPlane => newPlane.value === removeItem.value);

                console.log(currPlane);

                let currGeometry = currPlane[0].geo;
                let currMaterial = currPlane[0].mat;
                let currMesh = currPlane[0].mesh;

                console.warn("Plane Normal: ", currPlane[0].normal);
                

                currPlane[0].normal.geometry.dispose();
                currPlane[0].normal.material.dispose();
                scene.remove(currPlane[0].normal);

                currGeometry.dispose();
                currMaterial.dispose();
                scene.remove(currMesh);

                listRemove();

                selectRemove();
            }


    })

        function matrixRemove() {
            var removeItem = document.getElementById("remove-vector");
            

            
            let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === removeItem.value)
            
            // Remove from matrix selection
            let matrixSelect = document.getElementById("vector-select");
            for (let i = 0; i < matrixSelect.length; i++) {               
                if (matrixSelect[i].value == currVector[0]["value"]) {
                    matrixSelect.removeChild(matrixSelect[i]);
                }
            };
        }

        function listRemove() {
            let itemList = document.getElementById("vector-list");           
            var removeItem = document.getElementById("remove-vector");

            let item = removeItem.options[removeItem.selectedIndex];

            if (item.text == "vector") {

                let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === removeItem.value);
                let listItem = document.getElementById(removeItem.value);
                
                console.log("listItem: ", listItem);
                
                itemList.removeChild(listItem);
            }
            else if (item.text == "point") {
                let listItem = document.getElementById(removeItem.value)

                itemList.removeChild(listItem);
            }
            else if (item.text == "plane") {
                let listItem = document.getElementById(removeItem.value);

                itemList.removeChild(listItem);
            }
            
        }

        function selectRemove() {
            var removeItem = document.getElementById("remove-vector");
            let item = removeItem.options[removeItem.selectedIndex];
            
            if (item.text == "vector") {
            let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === removeItem.value);
            for (let i = 0; i < removeItem.length; i++) {
                if (removeItem[i].value == currVector[0]["value"]) {
                    removeItem.removeChild(removeItem[i])
                }
            }
            }
            else if (item.text == "point") {
                let currPoint = activePoints.filter(newPoint => newPoint.value === removeItem.value)
                console.log("currPoint: ", currPoint);
                for (let i = 0; i < removeItem.length; i++) {
                    if (removeItem[i].value == currPoint[0].value) {
                        removeItem.removeChild(removeItem[i])
            }
            }
            }
            else if (item.text == "plane") {
                let currPlane = activePlanes.filter(newPlane => newPlane.value === removeItem.value);
                console.log("currPlane: ", currPlane);
                for (let i = 0; i < removeItem.length; i++) {
                    if (removeItem[i].value == currPlane[0].value) {
                        removeItem.removeChild(removeItem[i])
                    }
                }
            }
}

    // Matrix Transformations

        let applyBtn = document.getElementById("apply-matrix-btn");
        var columnVector = [];
        

        let transN = 0;
        applyBtn.addEventListener("click", () => {            
            let matrixSelect = document.getElementById("vector-select");
            columnVector = [];
                    
            let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === matrixSelect.value)            
                        
            /* The array columnVector holds the x, y and z coordinates of a vector in a 2D array, 
                which emulates a 3x1 matrix
                */
            columnVector.push([currVector[0]["x"]]);
            columnVector.push([currVector[0]["y"]]);
            columnVector.push([currVector[0]["z"]]);
                                            
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
                    

            const transGeometry = new THREE.BufferGeometry().setFromPoints(transformCoords);
            const transMaterial = new THREE.LineBasicMaterial({color: 0xFF8B00});
                
            var transVector = new THREE.Line(transGeometry, transMaterial);
            scene.add(transVector);

            transN++;
            
            // Create a new list item for transformed vector (e.g: Vector 1 (Transform): (5, 4, 3))
            const vectorList = document.getElementById("vector-list");
            let transAppend = document.createElement("li");
            transAppend.textContent = (`${currVector[0]["name"]} (Transform)[${transN}]: (${transX}, ${transY}, ${transZ})`);     
            transAppend.id = (`${currVector[0]["value"]}-transform`);
                
                let tVectorObj = {
                    name: `${currVector[0]["name"]} (Transform)`,
                    value: `${currVector[0]["value"]}-transform`,
                    coords: `(${transX}, ${transY}, ${transZ})`,
                    geo: transGeometry,
                    mat: transMaterial,
                    mesh: transVector,
                    x: parseFloat(transX),
                    y: parseFloat(transY),
                    z: parseFloat(transZ)
                };
                
                var removeVector = document.getElementById("remove-vector");

                let vectorSelect = document.createElement("option");
                vectorSelect.text = "vector";
                vectorSelect.value = tVectorObj["value"];
                vectorSelect.label = tVectorObj["name"]
            
                removeVector.appendChild(vectorSelect);

                activeVectors.push(tVectorObj);

                vectorList.appendChild(transAppend);

                // Matrix Vector Select
        
                let vectorOpt = document.createElement("option");
                vectorOpt.text = tVectorObj["name"];
                vectorOpt.value = tVectorObj["value"];
        
        
                matrixSelect.appendChild(vectorOpt);

                console.log(activeVectors);
            
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

const loader = new THREE.FontLoader();

loader.load("font/mathfontitalic.json", function(font) {

    const yGeometry = new THREE.TextGeometry("y", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 1,
    })
    const yMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
    const yLabel = new THREE.Mesh(yGeometry, yMaterial);
    yLabel.position.set(-0.2, (size/2)+0.3, -0.05);
    scene.add(yLabel);
})


// # X Axis # //
const xPoints = []
xPoints.push(new THREE.Vector3(-(size/2),0,0));
xPoints.push(new THREE.Vector3((size/2), 0 ,0));
const xAxis_geo = new THREE.BufferGeometry().setFromPoints(xPoints);
const xAxis_mat = new THREE.LineBasicMaterial({color: 0xffffff});

const xAxis = new THREE.Line(xAxis_geo, xAxis_mat);
scene.add(xAxis)

loader.load("font/mathfontitalic.json", function(font) {

    const xGeometry = new THREE.TextGeometry("x", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 1,
    })
    const xMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
    const xLabel = new THREE.Mesh(xGeometry, xMaterial);
    xLabel.position.set((size/2)+0.05, -0.15, -0.01);
    scene.add(xLabel);
})

loader.load("font/mathfontitalic.json", function(font) {

    const xGeometry = new THREE.TextGeometry("-x", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 1,
    })
    const xMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
    const xLabel = new THREE.Mesh(xGeometry, xMaterial);
    xLabel.position.set(-((size/2))-0.7, -0.15, -0.01);
    scene.add(xLabel);
})

// # Z Axis # // 
const zPoints = []
zPoints.push(new THREE.Vector3(0,0,-(size/2)));
zPoints.push(new THREE.Vector3(0, 0, (size/2)));
const zAxis_geo = new THREE.BufferGeometry().setFromPoints(zPoints);
const zAxis_mat = new THREE.LineBasicMaterial({color: 0xffffff});

const zAxis = new THREE.Line(zAxis_geo, zAxis_mat);
scene.add(zAxis)

loader.load("font/mathfontitalic.json", function(font) {

    const zGeometry = new THREE.TextGeometry("z", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 1,
    })
    const zMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
    const zLabel = new THREE.Mesh(zGeometry, zMaterial);
    zLabel.position.set(-0.2, -0.15, (size/2)+0.05);
    scene.add(zLabel);
})

loader.load("font/mathfontitalic.json", function(font) {

    const zGeometry = new THREE.TextGeometry("-z", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 1,
    })
    const zMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
    const zLabel = new THREE.Mesh(zGeometry, zMaterial);
    zLabel.position.set(-0.2, -0.15, -((size/2))-0.2);
    scene.add(zLabel);
})

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