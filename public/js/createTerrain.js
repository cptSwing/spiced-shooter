// Generate a terrain
function createTerrain() {
    // allow for wider terrain to accomodate perspective camera
    var widthBeyondScreen = 0.3;
    var xSize = WIDTH + (WIDTH * widthBeyondScreen);
    var ySize = 10000;

    // yS: I need to have even distributing of segments to avoid stretching. floats throw an error, so round
    var xS = 50;
    var yS = Math.round(xS * (ySize / (WIDTH + (WIDTH * widthBeyondScreen) ) ) );

    terrainScene = THREE.Terrain({
        // Valid values include THREE.Terrain.Linear, .EaseIn, .EaseOut, .EaseInOut, .InEaseOut:
        easing: THREE.Terrain.EaseInOut,
        frequency: 4,
        heightmap: THREE.Terrain.Hill,
        material: new THREE.MeshStandardMaterial({color: 0x5566aa, metalness: 0 }),
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
    var decoMeshMat = new THREE.MeshStandardMaterial( { color: 0xFFAA00, metalness: 0 } );

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

    // I have no idea why I need to set a rotation of nothing to actually turn it the way I want it to be.
    terrainScene.rotation.x = 0;

    terrainScene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });


    scene.add(terrainScene);
}
