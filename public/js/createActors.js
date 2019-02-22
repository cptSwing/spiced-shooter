/* eslint no-undef: 0 */

var friendlyArr = [];
var friendlyBoundingBoxHelpersArr =[];
var friendlyBoundingBoxArr = [];


var enemyArr = [];
var enemyBoundingBoxHelpersArr = [];
var enemyBoundingBoxArr = [];

var heroModeloutlineMesh;

var laserBeamR1, laserBeamR2, laserBeamL1, laserBeamL2;
var laserBeamGroup;

function createActors() {

    addHero();

    addEnemy( [-200, 750] );
    addEnemy( [0, 1000] );
    addEnemy( [200, 1250] );

}

///////////////////////////

function addHero() {

    // deg converted to radiants
    heroModel.rotation.y = 90 * Math.PI / 180;
    heroModel.rotation.z = 90 * Math.PI / 180;

    heroModel.userData.hitpoints = 200;
    heroModel.userData.dealsCollisionDamageAmount = 50;

    heroModel.name = "Hero";

    // FFS. all SUBMESHES need the shadows flags set, properties are NOT inherited.
    heroModel.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true;
            node.receiveShadow = true;


            // generating boundingSpheres for CAMERA collision checking, these are null by default?
            if ( node.geometry.boundingSphere == null ) {
                node.geometry.computeBoundingSphere();
            }
        }
    });


    // helps us create bounding box and visualizes
    var heroBBoxHelper = new THREE.BoxHelper(heroModel, 0x00ff00);
    heroBBoxHelper.name = 'heroBBoxHelper';
    heroBBoxHelper.visible = false;
    scene.add(heroBBoxHelper);
    friendlyBoundingBoxHelpersArr.unshift(heroBBoxHelper);

    // our actual bounding box
    var heroBBox = new THREE.Box3().setFromObject(heroBBoxHelper);
    heroBBox.name = 'heroBBox';
    friendlyBoundingBoxArr.unshift(heroBBox);   // always at index 0 !


    // outline!
    var heroModeloutlineMaterial = new THREE.MeshBasicMaterial( { color: 0xFF0000, side: THREE.BackSide } );
    heroModeloutlineMesh = heroModel.clone();
    heroModeloutlineMesh.traverse( function( node ) {
        node.material = heroModeloutlineMaterial;
    });
    // heroModeloutlineMesh.rotation.y = 0 * Math.PI / 180;
    // heroModeloutlineMesh.rotation.x = 0 * Math.PI / 180;

    heroModeloutlineMesh.scale.multiplyScalar(1.1);
    heroModeloutlineMesh.name = 'heroModeloutlineMesh';
    heroModeloutlineMesh.visible = false;


    scene.add(heroModel);
    scene.add(heroModeloutlineMesh);
    friendlyArr.unshift(heroModel); // always at index 0!
}

////////////////

function addEnemy( posXY ) {
    var en = mobModel.clone(); // mobModel has loaded, yet not added

    en.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true;
        }
    });

    en.rotation.x = 90 * Math.PI / 180;
    en.rotation.y = 270 * Math.PI / 180; // Y Axis
    // en.rotation.z = 0 * Math.PI / 180; // "X" Axis, really

    en.name = enemyArr.length;

    en.userData.hitpoints = 100;
    en.userData.hitDistance = 75;
    en.userData.hit = false;
    en.userData.dealsCollisionDamageAmount = 50;
    en.userData.pointsIfKilled = 100;
    en.userData.movementFront = 1;

    en.position.set(posXY[0], posXY[1], 0);

    // helps us create bounding box and visualizes
    var enBBoxHelper = new THREE.BoxHelper(en, 0xff0000);
    enBBoxHelper.name = enemyArr.length;
    enBBoxHelper.visible = false;
    scene.add(enBBoxHelper);
    enemyBoundingBoxHelpersArr.push(enBBoxHelper);

    // our actual bounding box
    var enBBox = new THREE.Box3().setFromObject(enBBoxHelper);
    enBBox.name = enemyArr.length;
    enemyBoundingBoxArr.push(enBBox);


    // add to the terrainScene in order for everything to scroll downwards
    terrainScene.add(en);
    enemyArr.push(en);
}

///////////////

var loaded = true;
function shootLasers() {

    if (loaded) {
        var laserBeam	= new THREEx.LaserBeam();
        laserBeamGroup = new THREE.Group();

        laserBeamR1 = laserBeam.object3d;

        laserBeamR1.rotation.z = 90 * Math.PI / 180;
        laserBeamR1.userData.dealsDamageAmount = 50;

        laserBeamR2 = laserBeamR1.clone();
        laserBeamL1 = laserBeamR1.clone();
        laserBeamL2 = laserBeamR1.clone();

        laserBeamR1.position.x = 35;
        laserBeamR1.position.y = 62.5;
        laserBeamR2.position.x = 55;
        laserBeamR2.position.y = 50;

        laserBeamL1.position.x = -35;
        laserBeamL1.position.y = 62.5;
        laserBeamL2.position.x = -55;
        laserBeamL2.position.y = 50;

        laserBeamGroup.add( laserBeamR1, laserBeamR2, laserBeamL1, laserBeamL2 );
        // projectileArrFriendly.push( laserBeamR1, laserBeamR2, laserBeamL1, laserBeamL2 );

        // Make sure we fire from hero's positions
        laserBeamGroup.position.x = heroModel.position.x ;
        laserBeamGroup.position.y = heroModel.position.y ;
        laserBeamGroup.position.z = heroModel.position.z ;


        // helps us create bounding box and visualizes
        var laserBeamGroupBBoxHelper = new THREE.BoxHelper(laserBeamGroup, 0x0000ff);
        laserBeamGroupBBoxHelper.name = friendlyArr.length;
        laserBeamGroupBBoxHelper.visible = false;
        scene.add(laserBeamGroupBBoxHelper);
        friendlyBoundingBoxHelpersArr.push(laserBeamGroupBBoxHelper);

        // our actual bounding box
        var laserBeamGroupBBox = new THREE.Box3().setFromObject(laserBeamGroupBBoxHelper);
        laserBeamGroupBBox.name = friendlyArr.length;
        friendlyBoundingBoxArr.push(laserBeamGroupBBox);



        scene.add( laserBeamGroup );
        friendlyArr.push(laserBeamGroup);

        // Weapon cooldown
        loaded = false;
        setTimeout( () => {
            loaded = true;
        }, 500);
    }
}


//// I don't need this anymore, will keep for reference though
// function EnemyConstructor() {
//     var en = mobModel.clone(); // mobModel has loaded, yet not added
//
//     en.name = `Enemy ${enemyArr.length}`;
//
//     en.userData.hitpoints = 100;
//     en.userData.killDistance = 75;
//     en.userData.hit = false;
//     en.dealsCollisionDamageAmount = 50;
//
//     en.castShadow = true;
//     en.receiveShadow = true;
//
//     return en;
// }
