const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.OrthographicCamera(-0.5 * aspect, 0.5 * aspect, 0.5, -0.5, -10, 10);
const vertexShader = document.getElementById( 'vertexShader' ).textContent;
const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
const loader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planeMesh = new THREE.PlaneGeometry(1, 1);
const planeMat = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    millis: {value: 0.0},
    texture: {value: null}
  }
});

loader.load(
  'textures/test.png',
  function(texture) {
    plane.material.uniforms.texture.value = texture;
  }
);

let start = new Date();

const plane = new THREE.Mesh(planeMesh, planeMat);
plane.onBeforeRender = function() {
  plane.material.uniforms.millis.value = Date.now() - start;
}
scene.add(plane);

let zoom = 1;
let zoomVel = 0;
let zoomThrust = 0;
let zoomSpeed = 0.001;
let zoomTopSpeed = 0.05;


function zoomTick() {
  if (zoomThrust == 0) {
    let sign = Math.sign(zoomVel);
    zoomVel *= sign;
    zoomVel = Math.max(zoomVel - zoomSpeed, 0);
    zoomVel *= sign;
  } else {
    zoomVel += zoomThrust * zoomSpeed;
  }
  zoomVel = Math.max(-zoomTopSpeed, Math.min(zoomVel, zoomTopSpeed));
  zoom *= 1 + zoomVel;
}

function animate() {
  requestAnimationFrame(animate);
  zoomTick();
  plane.scale.set(zoom, zoom, zoom);
  renderer.render(scene, camera);
}

document.onkeydown = function(evt) {
  if (evt.key == 'ArrowUp') {
    zoomThrust = 1;
  } else if (evt.key == 'ArrowDown') {
    zoomThrust = -1;
  }
}

document.onkeyup = function(evt) {
  if (evt.key == 'ArrowUp') {
    zoomThrust = 0;
  } else if (evt.key == 'ArrowDown') {
    zoomThrust = 0;
  }
}

let mouseDown = false;
let oldMouse = {x: 0, y: 0};

document.onmousedown = function(evt) {
  mouseDown = true;
}

document.onmouseup = function(evt) {
  mouseDown = false;
}

document.onmousemove = function(evt) {
  if (mouseDown) {
    camera.rotation.y = -(2 * evt.x/window.innerWidth - 1);
    camera.rotation.x = -(2 * evt.y/window.innerHeight - 1);
  }
  oldMouse.x = evt.x;
  oldMouse.y = evt.y;
}

animate();