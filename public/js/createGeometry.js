function createGeometry() {
    /** LOAD GLTF MODELS: **/

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath('/');

    // Instantiate a loader - we also need the manager due to gltf's async loading (and the loader firing onLoad() too early)
    var manager = new THREE.LoadingManager();
    var loader = new THREE.GLTFLoader(manager);
    loader.setDRACOLoader(new THREE.DRACOLoader());

    manager.itemStart( 'hero' );
    // Load airplane resource:
    // (first function is called when resource is loaded, second while it is loading, third on errors)
    loader.load('./3d_content/hero.glb', function (gltf) {

        // need to assign this to a variable in order for key events to work (move model around)
        heroModel = gltf.scene;

        heroModel.position.x = 0;
        heroModel.position.y = 0;
        heroModel.position.z = 75;

        // deg converted to radiants
        heroModel.rotation.y = 90 * Math.PI / 180;
        heroModel.rotation.z = 90 * Math.PI / 180;

        // FFS. all SUBMESHES need the shadows flags set, properties are NOT inherited.
        heroModel.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        scene.add(heroModel);

        manager.itemEnd( 'foo' );

    }, function (xhr) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened: ', error);
    });

    // I assume the manager listens to 'itemEnd' events and then fires the following
    manager.onLoad = function () {
        console.log('everything is done');
        allGLTFLoaded = true;
    };


}
