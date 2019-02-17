var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, THREE, renderer, container, hemisphereLight, shadowLight, shadowLightHelper, shadowLightCameraHelper;
var heroModel, terrainModel;
var allGLTFLoaded = false;
var animationFrameId = null;

function createScene() {
    // Get the width and the height of the screen, use them to set up the aspect ratio of the camera and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    console.log(`WIDTH: `, WIDTH);
    console.log(`HEIGHT: `, HEIGHT);


    // Create the scene
    scene = new THREE.Scene();

    // scene.fog = new THREE.Fog(0xf7d9aa, 1000, 2000);

    camera = new THREE.OrthographicCamera(
        WIDTH / - 2,
        WIDTH / 2,
        HEIGHT / 2,
        HEIGHT / - 2,
        0,
        1000
    );


    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 500;
    camera.position.y = 0;


    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // alpha: true,
        // antialias: true
    });

    // Define the size of the renderer; in this case, it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add the DOM element of the renderer to the container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);

    function handleWindowResize() {
        // update height and width of the renderer and the camera
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    }
}

createScene();
createLights();
createGeometry();


/* CONTROLS: */
var transformSpeedMultiplier = 10;
var paused = false;

document.addEventListener('keydown', function(e) {
    if (e.code == 'ArrowUp') {
        if ( heroModel.position.y > (-HEIGHT / 2) && heroModel.position.y < (HEIGHT / 2) ) {
            heroModel.position.y += transformSpeedMultiplier * 1;
        } else {
            heroModel.position.y = 0;
        }
        // anim move forward
    }
    else if (e.code == 'ArrowDown') {
        if ( heroModel.position.y > (-HEIGHT / 2) && heroModel.position.y < (HEIGHT / 2) ) {
            heroModel.position.y -= transformSpeedMultiplier * 1;
        } else {
            heroModel.position.y = 0;
        }
        // anim move backward
    }
    else if (e.code == 'ArrowRight') {
        if ( heroModel.position.x > (-WIDTH / 2) && heroModel.position.x < (WIDTH / 2) ) {
            heroModel.position.x += transformSpeedMultiplier * 1;
        } else {
            heroModel.position.x = 0;
        }
        // anim move left
    }
    else if (e.code == 'ArrowLeft') {
        if ( heroModel.position.x > (-WIDTH / 2) && heroModel.position.x < (WIDTH / 2) ) {
            heroModel.position.x -= transformSpeedMultiplier * 1;
        } else {
            heroModel.position.x = 0;
        }
        // anim move right
    }
    else if (e.code == 'Pause') {
        if (!paused) {
            console.log(`Paused`);
            paused = !paused;
            cancelAnimationFrame(animationFrameId);
        } else {
            console.log(`Unpaused`);
            paused = !paused;
            animationFrameId = requestAnimationFrame( renderScene );
        }

    }
});

// var orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = true;

function renderScene() {
    // console.log(`terrainModel in renderScene(): `, terrainModel);
    terrainModel.position.y -= 1;
    shadowLight.target.position.y -= 1;
    shadowLight.position.y -= 1;

    animationFrameId = requestAnimationFrame( renderScene );
    renderer.render( scene, camera );
}

function checkIfDone() {
    if (allGLTFLoaded) {
        console.log(`allGLTFLoaded: `, allGLTFLoaded);
        renderScene();
    } else {
        setTimeout(function() {
            console.log(`allGLTFLoaded: `, allGLTFLoaded);
            checkIfDone();
        }, 1000);
    }
}

checkIfDone();
