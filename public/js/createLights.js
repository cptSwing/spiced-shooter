function createLights() {
    // A hemisphere light is a gradient colored light: the 1st parameter is the sky color, the 2nd parameter is the ground color, the 3d parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(0, 0, 500);
    shadowLight.castShadow = true;

    shadowLightHelper = new THREE.DirectionalLightHelper( shadowLight, 10);
    shadowLightCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -100;
    shadowLight.shadow.camera.right = 100;
    shadowLight.shadow.camera.top = 100;
    shadowLight.shadow.camera.bottom = -100;
    shadowLight.shadow.camera.near = 0;
    shadowLight.shadow.camera.far = 500;

    // define the resolution of the shadow; the higher the better, but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 1048;
    shadowLight.shadow.mapSize.height = 1048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(shadowLightHelper);
    scene.add(shadowLightCameraHelper);
}
