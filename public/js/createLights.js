function createLights() {
    // A hemisphere light is a gradient colored light: the 1st parameter is the sky color, the 2nd parameter is the ground color, the 3d parameter is the intensity of the light
    // hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 2.5);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(1500, 1500, 1500);
    shadowLight.castShadow = true;

    shadowLight.target.position.set(1000, 1000, 0);

    shadowLightHelper = new THREE.DirectionalLightHelper( shadowLight, 10);
    shadowLightCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -750;
    shadowLight.shadow.camera.right = 750;
    shadowLight.shadow.camera.top = 750;
    shadowLight.shadow.camera.bottom = -750;
    shadowLight.shadow.camera.near = 0;
    shadowLight.shadow.camera.far = 1200;

    // define the resolution of the shadow; the higher the better, but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 1048;
    shadowLight.shadow.mapSize.height = 1048;

    // to activate the lights, just add them to the scene
    // scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(shadowLight.target);
    scene.add(shadowLightHelper);
    scene.add(shadowLightCameraHelper);
}
