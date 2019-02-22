var terrainScene;
var cubeTexture;

// Generate a terrain
function createTerrain() {
    // allow for wider terrain to accomodate perspective camera
    var widthBeyondScreen = 0.4;
    var xSize = WIDTH + (WIDTH * widthBeyondScreen);
    var ySize = 10000;

    // yS: I need to have even distributing of segments to avoid stretching. floats throw an error, so round
    var xS = 60;
    var yS = Math.round(xS * (ySize / (WIDTH + (WIDTH * widthBeyondScreen) ) ) );

    var texLoader = new THREE.TextureLoader();

    var t1 = texLoader.load('./images/sand1.jpg', () => {} );
    var t2 = texLoader.load('./images/grass1.jpg', () => {} );
    var t3 = texLoader.load('./images/stone1.jpg', () => {} );

    // a LAMBERT material
    var blend = THREE.Terrain.generateBlendedMaterial([
        {texture: t1},  // basic
        {texture: t2, levels: [-250, -230, -135, -100]},    // blend in at, opaque from N to N, blend out at
        {texture: t3, levels: [-120, -105, -100, -100]},
    ]);

    blend.name = 'blend'

    terrainScene = THREE.Terrain({
        // Valid values include THREE.Terrain.Linear, .EaseIn, .EaseOut, .EaseInOut, .InEaseOut:
        easing: THREE.Terrain.EaseInOut,
        frequency: 4,
        heightmap: THREE.Terrain.Hill,
        material: blend,
        maxHeight: -100,
        minHeight: -250,
        steps: 2,
        stretch: true,
        turbulent: false,
        useBufferGeometry: false,
        xSize: xSize,
        ySize: ySize,
        xSegments: xS,
        ySegments: yS,
        after: function after(vertices, options) {
            // true turns the edges up; false turns them down; the number defines how far from edge the curvature starts; curve function
            THREE.Terrain.Edges( vertices, options, true, 300, THREE.Terrain.EaseInOut );
            // should add some smoothing here too
        }
    });

    terrainScene.castShadow = true;
    terrainScene.receiveShadow  = true;

    // Get the geometry of the terrain across which you want to scatter meshes
    var geo = terrainScene.children[0].geometry;

    var decoMeshGeo = new THREE.Mesh( new THREE.CylinderGeometry(1, 10, 50, 6) );
    // create a bounding box, and move its origin/center to the base (translate Y)
    decoMeshGeo.geometry.computeBoundingBox();
    decoMeshGeo.geometry.translate(0, 25, 0);
    var decoMeshMat = new THREE.MeshStandardMaterial( { color: 0x45772A, roughness: 0.85, metalness: 0 } );

    // Add randomly distributed foliage
    var decoScene = THREE.Terrain.ScatterMeshes(geo, {
        mesh: decoMeshGeo,
        w: xS,
        h: yS,
        spread: 0.02,
        randomness: Math.random,
    });

    // Terrain.ScatterMeshes() craps out when feeding Mesh with material, so I add it later on.
    decoScene.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = decoMeshMat;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    decoScene.castShadow = true;
    decoScene.receiveShadow  = true;

    terrainScene.add(decoScene);

    var seaPlaneGeo = new THREE.PlaneBufferGeometry(xSize, ySize, 1, 1);
    var seaPlaneMat = new THREE.MeshStandardMaterial({ color: 0x2662C2, roughness: 0.2, metalness: 0.85, transparent: true, opacity: 0.75 });
    var seaPlane = new THREE.Mesh(seaPlaneGeo, seaPlaneMat);
    seaPlane.position.z = -242.5;
    seaPlane.name = "seaPlane";
    seaPlane.receiveShadow = true;
    seaPlane.castShadow = true;

    terrainScene.add(seaPlane);

    // I have no idea why I need to set a rotation of nothing to actually turn it the way I want it to be.
    terrainScene.rotation.x = 0;

    terrainScene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });


    scene.add(terrainScene);

    // /** ADD CUBEMAP **/

    cubeTexture = new THREE.CubeTextureLoader().load( [
        './images/nevada_posX.jpg', './images/nevada_negX.jpg',
        './images/nevada_posY.jpg', './images/nevada_negY.jpg',
        './images/nevada_posZ.jpg', './images/nevada_negZ.jpg'
    ], (xhr) => {
        console.log(`xhr: `, xhr);
    }, err => {
        console.log(`loading image error: `, err);
    } );

}
