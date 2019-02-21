/* eslint no-undef: 0 */
var scene, camera, cameraFrustum, cameraViewProjectionMatrix, HEIGHT, WIDTH, renderer, container;


function createScene() {
    // Get the width and the height of the screen, use them to set up the aspect ratio of the camera and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    console.log(`WIDTH: `, WIDTH);
    console.log(`HEIGHT: `, HEIGHT);


    // Create the scene
    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0xf7d9aa, 0.0004);

    // // color, near, far
    // scene.fog = new THREE.Fog(0xf7d9aa, 1500, 2000);

    // field of view, aspect ratio, near plane, far plane
    camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 5000);

    // Set the position of the camera. Y is a bit of a drag in that I need to set arbitrary values to fit 0 0 0 on the center of the screen (perspective distortion)
    camera.position.x = 0;
    camera.position.z = 600;
    camera.position.y =  -500;
    camera.rotation.x = 40 * Math.PI / 180;

    cameraFrustum = new THREE.Frustum();
    cameraViewProjectionMatrix = new THREE.Matrix4();

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // alpha: true,
        // antialias: true
    });

    // Define the size of the renderer; in this case, it will fill the entire screen
    renderer.setSize(WIDTH/2, HEIGHT/2);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add the DOM element of the renderer to the container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    var c = document.querySelector('#world > canvas');
    c.style.width = WIDTH + 'px';
    c.style.height = HEIGHT + 'px';
    c.style.imageRendering = 'pixelated'

    // Listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
    function handleWindowResize() {
        // update height and width of the renderer and the camera
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize(WIDTH/2, HEIGHT/2);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        c.style.width = WIDTH + 'px';
        c.style.height = HEIGHT + 'px';
    }

}
