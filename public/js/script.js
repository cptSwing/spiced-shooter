var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, THREE,
    renderer, container, hemisphereLight, shadowLight, heroModel;

var transformSpeedMultiplier = 10;


function createScene() {
    // Get the width and the height of the screen, use them to set up the aspect ratio of the camera and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    console.log(`WIDTH: `, WIDTH);
    console.log(`HEIGHT: `, HEIGHT);


    // Create the scene
    scene = new THREE.Scene();

    // Add a fog effect to the scene; same color as the background color used in the style sheet. first value:  range at which starts affecting, second: at which fog stops
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
    camera.position.z = 750;
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

function createLights() {
    // A hemisphere light is a gradient colored light: the 1st parameter is the sky color, the 2nd parameter is the ground color, the 3d parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

    // A directional light shines from a specific direction. It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    // Set the direction of the light
    shadowLight.position.set(0, 150, 1500);
    // Allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -500;
    shadowLight.shadow.camera.right = 500;
    shadowLight.shadow.camera.top = 500;
    shadowLight.shadow.camera.bottom = -500;
    shadowLight.shadow.camera.near = 0;
    shadowLight.shadow.camera.far = 2000;

    // define the resolution of the shadow; the higher the better, but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 1048;
    shadowLight.shadow.mapSize.height = 1048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createGeometry() {
    // width, height, segments
    var planeGeometry = new THREE.PlaneGeometry( 1250, 2000, 2 );
    var planeMaterial = new THREE.MeshBasicMaterial( {color: 0x1B6525} );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add( plane );
}

function loadGeometry() {
    // Instantiate a loader
    var loader = new THREE.GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath('./js/');
    THREE.DRACOLoader.setDecoderConfig({type: 'js'});
    loader.setDRACOLoader(new THREE.DRACOLoader());

    // Load a glTF resource
    loader.load('./3d_content/hero.glb', function (gltf) {
        heroModel = gltf.scene;

        heroModel.scale.x = 0.125;
        heroModel.scale.y = 0.125;
        heroModel.scale.z = 0.125;

        heroModel.position.x = 0;
        heroModel.position.y = 0;
        heroModel.position.z = 50;

        // Is the model rotated via euler or quaternion values?

        // heroModel.rotation.x = Math.PI / 2;
        heroModel.rotation.y = Math.PI / 2;
        heroModel.rotation.z = Math.PI / 2;

        heroModel.castShadow = true;

        console.log(`heroModel.rotation: `, heroModel.rotation);

        scene.add(heroModel);
    }, function (xhr) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened: ', error);
    });
}

function render() {

    // If model has loaded.. :
    // if (heroModel) {
    //     heroModel.rotation.x += 0.01;
    // }


    requestAnimationFrame( render );
    renderer.render( scene, camera );
}

createScene();
createLights();
createGeometry();
loadGeometry();


/* CONTROLS: */
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
        console.log(`Paused`);
    }

    console.log(`heroModel.position.y: `, heroModel.position.y);
    console.log(`heroModel.position.x: `, heroModel.position.x);
});

// var orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = false;

render();
