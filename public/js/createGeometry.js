/* eslint no-undef: 0 */

// Instantiate a loader - we also need the manager due to gltf's async loading (and the loader firing onLoad() too early)
var manager = new THREE.LoadingManager();
var loader = new THREE.GLTFLoader(manager);
loader.setDRACOLoader(new THREE.DRACOLoader());
THREE.DRACOLoader.setDecoderPath('/'); // Optional: Provide DRACOLoader to decode compressed mesh
var allGLTFLoaded = false;


// Define our loaded GLTF model variables here:
var heroModel;
var mobModel;

function createGeometry() {
    /** LOAD GLTF MODELS: **/
    createHero();
    createMob();

    // I assume the manager listens to 'itemEnd' events and then fires the following
    manager.onLoad = function () {
        console.log('Every model is loaded.');
        allGLTFLoaded = true;
    };
}

//////////////////////////////////

function createHero() {
    manager.itemStart( 'hero' ); // fire event

    // Load airplane resource: (first function is called when resource is loaded, second while it is loading, third on errors)
    loader.load('./3d_content/hero.glb', function (gltf) {
        heroModel = gltf.scene;
        manager.itemEnd( 'hero' ); // fire event

    }, function (xhr) {
        // console.log('hero ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened: ', error);
    });
}

function createMob() {
    manager.itemStart( 'mob' );

    loader.load('./3d_content/mob.glb', function (gltf) {
        mobModel = gltf.scene;
        manager.itemEnd( 'mob' );

    }, function (xhr) {
        // console.log('mob ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened: ', error);
    });
}
