// Generate a terrain
function createTerrain() {
    // allow for wider terrain to accomodate perspective camera
    var widthBeyondScreen = 0.4;
    var xSize = WIDTH + (WIDTH * widthBeyondScreen);
    var ySize = 10000;

    // yS: I need to have even distributing of segments to avoid stretching. floats throw an error, so round
    var xS = 60;
    var yS = Math.round(xS * (ySize / (WIDTH + (WIDTH * widthBeyondScreen) ) ) );

    terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 5,
        heightmap: THREE.Terrain.Hill,
        material: new THREE.MeshStandardMaterial({color: 0x5566aa, metalness: 0 }),
        maxHeight: 25,
        minHeight: -200,
        steps: 4,
        stretch: true,
        useBufferGeometry: false,
        xSize: xSize,
        ySize: ySize,
        xSegments: xS,
        ySegments: yS
    });
    terrainScene.castShadow = true;
    terrainScene.receiveShadow  = true;

    // Get the geometry of the terrain across which you want to scatter meshes
    var geo = terrainScene.children[0].geometry;

    var decoMeshGeo = new THREE.Mesh( new THREE.CylinderGeometry(1, 10, 100, 6) );
    // create a bounding box, and move its origin to the base (translate x Y z)
    decoMeshGeo.geometry.computeBoundingBox();
    decoMeshGeo.geometry.translate(0, 50, 0);
    console.log(`decoMeshGeo: `, decoMeshGeo);
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
