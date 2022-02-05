import "./matrix.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { Camera, Sphere, WebGLBufferRenderer } from "three"

// Debug
const gui = new dat.GUI();

// Canvas 
const canvas = document.getElementById("#canv");

// -- Scene -- //
const scene = new THREE.Scene();

// -- Camera -- // 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// -- Renderer -- //
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(0, 0, 2);

renderer.render(scene, camera);