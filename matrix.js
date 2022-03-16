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

// DEFINING OBJECTS //

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

    const normalColours = [
        0xAFFFAA,
        0xFEFFAA,
        0xFFD7AA,
        0xFFAAAA,
        0xAAFFFB,
        0xAAB8FF,
        0xD3AAFF,
        0xFFAAFC
    ]

    const planeColours = [
        0x38E69C,
        0x38E65A,
        0x92E638,
        0x00D661
    ]

    if (a != NaN && b != NaN && c != NaN && d != NaN) {
        let planeHex = planeColours[Math.floor(Math.random()*planeColours.length)];
        planeGeometry = new THREE.BufferGeometry(100, 100);
        planeMaterial = new THREE.MeshBasicMaterial({color: planeHex, 
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
        normalPoints.push(new THREE.Vector3(0, 0, 0));  
        normalPoints.push(new THREE.Vector3((scaledNormal_x*3), (scaledNormal_y*3), (scaledNormal_z*3)));
    

        let normalHex = normalColours[Math.floor(Math.random()*normalColours.length)];
        console.log("Colour List: ", normalColours);
        console.log("normalColour: ", normalHex);
        let normalVectorGeometry = new THREE.BufferGeometry().setFromPoints(normalPoints);
        let normalVectorMaterial = new THREE.LineBasicMaterial({color: normalHex});
        normalVector = new THREE.Line(normalVectorGeometry, normalVectorMaterial);
        
        
        // console.log("Angle of normal = ", normalAngleX, normalAngleY, normalAngleZ);


        scene.add(normalVector);

        let constant = (d/normalMagnitude);

        let scale = -(constant);

        if (Math.abs(scale) < 1e-8) {
            scale = 1e-8
        }

        plane.scale.set(0.5 * 100, 0.5 * 100, scale);
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
let vecType = document.getElementById("vector-type");
console.log(typeof(vecType.value));

let parametricTerm = document.getElementById("vector-parametric");


vecType.addEventListener("change", () => {
    console.log("Selected option: ", vecType.value)
    if (vecType.value == "Parametric") {
        parametricTerm.style.visibility = "visible"
        
    }
    else {
        parametricTerm.style.visibility = "hidden"
    }
})

vecBtn.addEventListener("click", vectorCreate);

let vectorN = 0;

// Vector List //

var activeVectors = [];
function vectorCreate() {
        
        var iComponent = parseFloat(document.getElementById("vector_i").value);
        var jComponent = parseFloat(document.getElementById("vector_j").value);
        var kComponent = parseFloat(document.getElementById("vector_k").value);

        var lambda = parseFloat(document.getElementById("vector_lambda").value);
        console.log("Lambda = ", lambda);
        var iDirection = parseFloat(document.getElementById("vector_d").value);
        var jDirection = parseFloat(document.getElementById("vector_e").value);
        var kDirection = parseFloat(document.getElementById("vector_f").value);

        var iParameter = parseFloat(lambda*iDirection).toFixed(2);
        var jParameter = parseFloat(lambda*jDirection).toFixed(2);
        var kParameter = parseFloat(lambda*kDirection).toFixed(2);

        var directionX = parseFloat(parseFloat(iComponent) + parseFloat(iParameter))
        var directionY = parseFloat(parseFloat(jComponent) + parseFloat(jParameter))
        var directionZ = parseFloat(parseFloat(kComponent) + parseFloat(kParameter))
    

        var vectorGeometry;
        var vectorMaterial;
        var vector;

 
        if (iComponent !== NaN && jComponent != NaN && kComponent != NaN) {               

            // Line Vectors
            const vPoints = [];
        
            if (vecType.value == "Singular") {
                vPoints.push(new THREE.Vector3(0, 0, 0));
                vPoints.push(new THREE.Vector3(iComponent, jComponent, kComponent));
            }
            else if (vecType.value == "Parametric") {
                vPoints.push(new THREE.Vector3(0, 0, 0))
                vPoints.push(new THREE.Vector3(iComponent, jComponent, kComponent));
                vPoints.push(new THREE.Vector3(parseFloat(directionX), parseFloat(directionY), parseFloat(directionZ)));
                console.log(vPoints);
            }
        

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
        
        let vectorObj;
        
        if (vecType.value == "Singular") {
        vectorObj = {
            name: `Vector ${vectorN}`,
            value: `vector-${vectorN}`,
            coords: `(${iComponent}, ${jComponent}, ${kComponent})`,
            type: "vector",
            geo: vectorGeometry,
            mat: vectorMaterial,
            mesh: vector,
            index: vectorN,
            x: iComponent,
            y: jComponent,
            z: kComponent
        };
    }
    else if (vecType.value == "Parametric") {
        vectorObj = {
            name: `Vector ${vectorN}`,
            value: `vector-${vectorN}`,
            coords: `(${iComponent}, ${jComponent}, ${kComponent}) + (${directionX}, ${directionY}, ${directionZ})`,
            type: "vector-param",
            geo: vectorGeometry,
            mat: vectorMaterial,
            mesh: vector,
            index: vectorN,
            x: iComponent,
            y: jComponent,
            z: kComponent,
            lambdaX: directionX,
            lambdaY: directionY,
            lambdaZ: directionZ
        }
    }
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
        var columnVectorLambda = [];

        let transN = 0;
        applyBtn.addEventListener("click", () => {            
            let matrixSelect = document.getElementById("vector-select");
            columnVector = [];
            columnVectorLambda = [];
                    
            let currVector = activeVectors.filter(vectorObj => vectorObj["value"] === matrixSelect.value)            
                        
            /* The array columnVector holds the x, y and z coordinates of a vector in a 2D array, 
                which emulates a 3x1 matrix
                */

            if (currVector[0].type == "vector"){
            columnVector.push([currVector[0]["x"]]);
            columnVector.push([currVector[0]["y"]]);
            columnVector.push([currVector[0]["z"]]);
            }
            else if (currVector[0].type == "vector-param") {
            columnVector.push([currVector[0]["x"]]);
            columnVector.push([currVector[0]["y"]]);
            columnVector.push([currVector[0]["z"]]);
            console.log("columnVector: ", columnVector);
        

            columnVectorLambda.push([currVector[0]["lambdaX"]]);
            columnVectorLambda.push([currVector[0]["lambdaY"]]);
            columnVectorLambda.push([currVector[0]["lambdaZ"]]);
            console.log("columnVectorLambda: ", columnVectorLambda);
            }
            
                // Matrix Calculations //
            let matrixA = document.getElementById("matrix-a").value;
            let matrixB = document.getElementById("matrix-b").value;
            let matrixC = document.getElementById("matrix-c").value;
                
            let matrixD = document.getElementById("matrix-d").value;
            let matrixE = document.getElementById("matrix-e").value;
            let matrixF = document.getElementById("matrix-f").value;
                
            let matrixG = document.getElementById("matrix-g").value;
            let matrixH = document.getElementById("matrix-h").value;
            let matrixI = document.getElementById("matrix-i").value;
                
            let transformCoords = [];
                
            let transX = 0;
            let transY = 0;
            let transZ = 0;

            let transLambdaX = 0;
            let transLambdaY = 0;
            let transLambdaZ = 0;
                
            if (currVector[0].type == "vector") {
            transX = ((matrixA * columnVector[0][0]) + (matrixB * columnVector[1][0]) + (matrixC * columnVector[2][0]));
            transY = ((matrixD * columnVector[0][0]) + (matrixE * columnVector[1][0]) + (matrixF * columnVector[2][0]));
            transZ = ((matrixG * columnVector[0][0]) + (matrixH * columnVector[1][0]) + (matrixI * columnVector[2][0]));
            
            transformCoords.push(new THREE.Vector3(0, 0, 0));
            transformCoords.push(new THREE.Vector3(transX, transY, transZ));            
            }
            else if (currVector[0].type == "vector-param") {
            transX = ((matrixA * columnVector[0][0]) + (matrixB * columnVector[1][0]) + (matrixC * columnVector[2][0]));
            transY = ((matrixD * columnVector[0][0]) + (matrixE * columnVector[1][0]) + (matrixF * columnVector[2][0]));
            transZ = ((matrixG * columnVector[0][0]) + (matrixH * columnVector[1][0]) + (matrixI * columnVector[2][0]));

            transLambdaX = ((matrixA * columnVectorLambda[0][0]) + (matrixB * columnVectorLambda[1][0]) + (matrixC * columnVectorLambda[2][0]));
            transLambdaY = ((matrixD * columnVectorLambda[0][0]) + (matrixE * columnVectorLambda[1][0]) + (matrixF * columnVectorLambda[2][0]));
            transLambdaZ = ((matrixG * columnVectorLambda[0][0]) + (matrixH * columnVectorLambda[1][0]) + (matrixI * columnVectorLambda[2][0]));

            transLambdaX = (Math.round(transLambdaX * 100) / 100).toFixed(2);
            transLambdaY = (Math.round(transLambdaY * 100) / 100).toFixed(2);
            transLambdaZ = (Math.round(transLambdaZ * 100) / 100).toFixed(2);

            transformCoords.push(new THREE.Vector3(0, 0, 0));
            transformCoords.push(new THREE.Vector3(transX, transY, transZ)); 
            transformCoords.push(new THREE.Vector3(transLambdaX, transLambdaY, transLambdaZ));
            }

            const transGeometry = new THREE.BufferGeometry().setFromPoints(transformCoords);
            const transMaterial = new THREE.LineBasicMaterial({color: 0xFF8B00});
                
            var transVector = new THREE.Line(transGeometry, transMaterial);
            scene.add(transVector);

            transN++;
            
            // Create a new list item for transformed vector (e.g: Vector 1 (Transform): (5, 4, 3))
            const vectorList = document.getElementById("vector-list");
            let transAppend = document.createElement("li");
            


            let tVectorObj;

            if (currVector[0].type == "vector") {
            tVectorObj = {
                name: `${currVector[0]["name"]} (Transform)`,
                value: `${currVector[0]["value"]}-transform[${transN}]`,
                coords: `(${transX}, ${transY}, ${transZ})`,
                type: "vector",
                geo: transGeometry,
                mat: transMaterial,
                mesh: transVector,
                x: transX,
                y: transY,
                z: transZ
            };
        }
        else if (currVector[0].type == "vector-param") {
            tVectorObj = {
                name: `${currVector[0]["name"]} (Transform)`,
                value: `${currVector[0]["value"]}-transform[${transN}]`,
                coords: `(${transX}, ${transY}, ${transZ}) + (${transLambdaX}, ${transLambdaY}, ${transLambdaZ})`,
                type: "vector-param",
                geo: transGeometry,
                mat: transMaterial,
                mesh: transVector,
                x: transX,
                y: transY,
                z: transZ,
                lambdaX: transLambdaX,
                lambdaY: transLambdaY,
                lambdaZ: transLambdaZ
            }
        }
            
        transAppend.textContent = (`${currVector[0]["name"]} (Transform): ${tVectorObj["coords"]}`);     
            transAppend.id = (`${currVector[0]["value"]}-transform[${transN}]`);
                
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

// -- Button Examples -- //

var ninetyX = document.getElementById("ninety-deg-x");
var ninetyY = document.getElementById("ninety-deg-y");
var ninetyZ = document.getElementById("ninety-deg-z");
var oneeightyX = document.getElementById("oneeighty-deg-x");
var oneeightyY = document.getElementById("oneeighty-deg-y");
var oneeightyZ = document.getElementById("oneeighty-deg-z");

// Matrix
let valA = document.getElementById("matrix-a");
let valB = document.getElementById("matrix-b");
let valC = document.getElementById("matrix-c");

let valD = document.getElementById("matrix-d");
let valE = document.getElementById("matrix-e");
let valF = document.getElementById("matrix-f");

let valG = document.getElementById("matrix-g");
let valH = document.getElementById("matrix-h");
let valI = document.getElementById("matrix-i");

// ? 90 DEGREES ? //
ninetyX.addEventListener("click", () => {
    valA.textContent = "1";
    valA.value = 1;

    valB.textContent = "0";
    valB.value = 0;

    valC.textContent = "0";
    valC.value = 0;

    valD.textContent = "0";
    valD.value = 0;
    
    valE.textContent = "0";
    valE.value = 0;

    valF.textContent = "-1";
    valF.value = -1;

    valG.textContent = "0";
    valG.value = 0;

    valH.textContent = "1";
    valH.value = 1;

    valI.textContent = "0";
    valI.value = 0;
})

ninetyY.addEventListener("click", () => {
    valA.textContent = "0";
    valA.value = 0;

    valB.textContent = "0";
    valB.value = 0;

    valC.textContent = "-1";
    valC.value = -1;

    valD.textContent = "0";
    valD.value = 0;
    
    valE.textContent = "1";
    valE.value = 1;

    valF.textContent = "0";
    valF.value = 0;

    valG.textContent = "1";
    valG.value = 1;

    valH.textContent = "0";
    valH.value = 0;

    valI.textContent = "0";
    valI.value = 0;
})

ninetyZ.addEventListener("click", () => {
    valA.textContent = "0";
    valA.value = 0;

    valB.textContent = "-1";
    valB.value = -1;

    valC.textContent = "0";
    valC.value = 0;

    valD.textContent = "1";
    valD.value = 1;
    
    valE.textContent = "0";
    valE.value = 0;

    valF.textContent = "0";
    valF.value = 0;

    valG.textContent = "0";
    valG.value = 0;

    valH.textContent = "0";
    valH.value = 0;

    valI.textContent = "1";
    valI.value = 1;
})

// ? 180 DEGREES ? //
oneeightyX.addEventListener("click", () => {
    valA.textContent = "1";
    valA.value = 1;

    valB.textContent = "0";
    valB.value = 0;

    valC.textContent = "0";
    valC.value = 0;

    valD.textContent = "0";
    valD.value = 0;
    
    valE.textContent = "-1";
    valE.value = -1;

    valF.textContent = "0";
    valF.value = 0;

    valG.textContent = "0";
    valG.value = 0;

    valH.textContent = "0";
    valH.value = 0;

    valI.textContent = "-1";
    valI.value = -1;
})

oneeightyY.addEventListener("click", () => {
    valA.textContent = "-1";
    valA.value = -1;

    valB.textContent = "0";
    valB.value = 0;

    valC.textContent = "0";
    valC.value = 0;

    valD.textContent = "0";
    valD.value = 0;
    
    valE.textContent = "1";
    valE.value = 1;

    valF.textContent = "0";
    valF.value = 0;

    valG.textContent = "0";
    valG.value = 0;

    valH.textContent = "0";
    valH.value = 0;

    valI.textContent = "-1";
    valI.value = -1;
})

oneeightyZ.addEventListener("click", () => {
    valA.textContent = "-1";
    valA.value = -1;

    valB.textContent = "0";
    valB.value = 0;

    valC.textContent = "0";
    valC.value = 0;

    valD.textContent = "0";
    valD.value = 0;
    
    valE.textContent = "-1";
    valE.value = -1;

    valF.textContent = "0";
    valF.value = 0;

    valG.textContent = "0";
    valG.value = 0;

    valH.textContent = "0";
    valH.value = 0;

    valI.textContent = "1";
    valI.value = 1;
})

// -- Grid Plane -- //

var size = 100;
var step = 100;

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