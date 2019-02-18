var scene, camera, cameraFrustum, HEIGHT, WIDTH, THREE, renderer, container, hemisphereLight, shadowLight, shadowLightHelper, shadowLightCameraHelper;
var heroModel, heroModelBoundingBox, terrainScene;
var allGLTFLoaded = false;
var animationFrameId = null;
var enemyArr = [];

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
    camera.position.y =  -(HEIGHT*0.5);
    camera.rotation.x = 40 * Math.PI / 180;

    camera.updateMatrix();
    camera.updateMatrixWorld();
    cameraFrustum = new THREE.Frustum();
    cameraFrustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ));

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


/* CONTROLS: */
var transformSpeedMultiplier = 10;
var paused = false;

document.addEventListener('keydown', function(e) {
    if (e.code == 'ArrowUp') {
        // if ( heroModel.position.y > (-HEIGHT / 2) && heroModel.position.y < (HEIGHT / 2) ) {
            heroModel.position.y += transformSpeedMultiplier * 1;
        // } else {
            // heroModel.position.y = 0;
        // }
        // anim move forward
        camera.updateMatrix();
        camera.updateMatrixWorld();

        collision = cameraFrustum.intersectsBox( heroModelBoundingBox );
        console.log(`collision`, collision);


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
            // call anim again and collect new ID in the process
            animationFrameId = requestAnimationFrame( update );
        }

    }
});



createScene();
createLights();
createGeometry();
createTerrain();
createEnemies();

var collision;

function update() {
    terrainScene.position.y -= 1;

    function enemyCollision(){
        // Use to also check if enemy has left screen ?? (remove from array of enemies)

        enemyArr.forEach( (val, idx) => {
            // THREE's distanceTo is a method of Vector3(), so we need to use this
            var enemyPos = new THREE.Vector3();

            // since for some reason setFromMatrixPosition initializes with 0 0 0, there was a hit event at the very start. hence setTimeout
            setTimeout(function() {

                // this updates the world position of the enemies each frame
                enemyPos.setFromMatrixPosition( val.matrixWorld );

                if ( Math.floor( enemyPos.distanceTo( heroModel.position ) ) <= val.killDistance && !val.hit ) {
                    val.hit = true; // to avoid multiple hits
                    console.log(`\n==========\nhit!\n==========`);
                    console.log(`enemyPos ${idx}: `, enemyPos);
                    console.log(`idx, val: `, idx, val);

                // turn the hit counter back to false after we back off. possibly need to tune killDistance / 2 or something
                } else if ( Math.floor( enemyPos.distanceTo( heroModel.position ) ) >= val.killDistance && val.hit ) {
                    val.hit = false;
                    console.log(`val.hit: `, val.hit);
                    // hasCollided=true;
                    // explode();
                }

            }, 100);
        });
    }
    enemyCollision();

    animationFrameId = requestAnimationFrame( update );
    renderer.render( scene, camera );
}

function checkIfDone() {
    if (allGLTFLoaded) {
        console.log(`allGLTFLoaded: `, allGLTFLoaded);
        update();
    } else {
        setTimeout(function() {
            console.log(`allGLTFLoaded: `, allGLTFLoaded);
            checkIfDone();
        }, 1000);
    }
}

checkIfDone();

// orbit controls I use for debugging - mess with the viewport bounds though (re keyboardcontrol of hero)
// var orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = true;
