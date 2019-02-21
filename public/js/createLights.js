var hemisphereLight, shadowLight, shadowLightHelper, shadowLightCameraHelper;

function createLights() {
    // A hemisphere light is a gradient colored light: the 1st parameter is the sky color, the 2nd parameter is the ground color, the 3d parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 1.25);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set( 0, 300, 200);
    shadowLight.castShadow = true;

    shadowLight.target.position.set(100, 300, 0);

    // second arg is size
    shadowLightHelper = new THREE.DirectionalLightHelper( shadowLight, 100);
    shadowLightCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);


    // setup the directional light's _shadow camera_ (an ortho for rendering directional shadows)
    // args as follows: left (-100), right (100), top (100), bottom (-100), near (0.5), far (1000)
    shadowLight.shadow.camera = new THREE.OrthographicCamera( -1000, 1000, 500, -1000, -100, 1500 );

    // define the resolution of the shadow; the higher the better, but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(shadowLight.target);
    scene.add(shadowLightHelper);
    scene.add(shadowLightCameraHelper);
}
