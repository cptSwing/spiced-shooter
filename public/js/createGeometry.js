function createGeometry() {
    // width, height, segments
    var planeGeometry = new THREE.PlaneBufferGeometry( 1250, 2000, 2 );
    var planeMaterial = new THREE.MeshStandardMaterial( {color: 0x1B6525, name: 'planeMaterial'} );
    plane = new THREE.Mesh( planeGeometry, planeMaterial );
    console.log(`planeGeometry, planeMaterial: `, planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add( plane );

    /** LOAD GLTF MODELS: **/

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath('/');

    // Instantiate a loader
    var loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(new THREE.DRACOLoader());

    // Load plane resource
    loader.load('./3d_content/hero.glb', function (gltf) {
        gltf.scene.scale.x = 0.125;
        gltf.scene.scale.y = 0.125;
        gltf.scene.scale.z = 0.125;

        gltf.scene.position.x = 0;
        gltf.scene.position.y = 0;
        gltf.scene.position.z = 50;


        // gltf.scene.rotation.x = Math.PI / 2; this is annoyingly in RADients
        gltf.scene.rotation.y = Math.PI / 2;
        gltf.scene.rotation.z = Math.PI / 2;

        // FFS. all SUBMESHES need the shadows flags set, properties are NOT inherited.
        gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        // need to assign this in order for key events to work (move model around)
        heroModel = gltf.scene
        scene.add(heroModel);
    }, function (xhr) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened: ', error);
    });
}
