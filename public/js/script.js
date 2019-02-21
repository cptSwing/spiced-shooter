// /* eslint-disable */
/* eslint no-undef: 0 */


var projectileArrFriendly = [];
var playerScore = 0;
var playerHealthElement = document.getElementById('player_health');
var playerScoreElement = document.getElementById('player_score');

/** BEGIN STUFF **/

createGeometry();   // load gltf models first
continueIfLoadingDone(); // runs init

function init() {
    createScene();
    createLights();
    createParticles();
    createTerrain();
    createActors();

    everythingElse(); // what else needs initializing
    function everythingElse() {
        // orbit controls I use for debugging - mess with the viewport bounds though (re keyboardcontrol of hero)
        // var orbit = new THREE.OrbitControls(camera, renderer.domElement);
        // orbit.enableZoom = true;
    }

    update();
}

var animationFrameId = null;
/* UPDATE function which runs every frame */

function update() {
    animationFrameId = requestAnimationFrame( update ); // up top to ensure pausing from within child fn. will run update() before, though!

    terrainScene.position.y -= 0.75;    // scrolling..

    updateCameraMatrix();

    playerBehaviour();
    enemyBehaviour();
    projectileBehaviour();

    proton.update(clock.getDelta());    // this we need. Because reasons.
    Proton.Debug.renderInfo(proton, 3);

    renderer.render( scene, camera );
}


/** MAIN FUNCTION BLOCK **/

function continueIfLoadingDone() {
    if (allGLTFLoaded) {
        console.log(`allGLTFLoaded: `, allGLTFLoaded);
        init(); // start things
    }
    else {
        setTimeout(function() {
            console.log(`allGLTFLoaded: not yet fully loaded.`);
            continueIfLoadingDone();
        }, 2000);
    }
}

/** THE FOLLOWING UPDATE EACH FRAME **/
function updateCameraMatrix() {
    // Not entirely sure what this does. Possibly this needs to watch the objects instead of updating the camera all the time?
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse( camera.matrixWorld );
    cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    cameraFrustum.setFromMatrix( cameraViewProjectionMatrix );

    // target the largest submeshes' boundingSphere
    // console.log(`cameraFrustum.intersectsObject ( heroModel ): `, cameraFrustum.intersectsObject ( heroModel.children[0].children[0] ));
}

function playerBehaviour() {

    for (var i = 0; i < friendlyBoundingBoxHelpersArr.length; i++) {
        friendlyBoundingBoxHelpersArr[i].update();
        friendlyBoundingBoxArr[i].setFromObject(friendlyBoundingBoxHelpersArr[i]);
    }

    // kind of a shitty way to have them follow each other, but them's the breaks
    jetSmokeEmitterR.p.x = heroModel.position.x + 20;
    jetSmokeEmitterR.p.y = heroModel.position.y - 22.5;
    jetSmokeEmitterR.p.z = heroModel.position.z;

    jetSmokeEmitterL.p.x = heroModel.position.x - 20;
    jetSmokeEmitterL.p.y = heroModel.position.y - 22.5;
    jetSmokeEmitterL.p.z = heroModel.position.z;

    playerHealthElement.innerHTML = heroModel.userData.hitpoints;
    playerScoreElement.innerHTML = playerScore;

    if ( heroModel.userData.hitpoints <= 0 ) {
        destroy( heroModel, null );
    }
}

function enemyBehaviour() {




    for (var i = 0; i < enemyBoundingBoxHelpersArr.length; i++) {
        enemyBoundingBoxHelpersArr[i].update();
        enemyBoundingBoxArr[i].setFromObject(enemyBoundingBoxHelpersArr[i]);
    }

    for (let i = 0; i < enemyArr.length; i++) {
        var currentEnemy = enemyArr[i];

        currentEnemy.children[0].children[0].children[1].rotation.x -= 75;

        enemyCollision( currentEnemy, i );   // currentEnemy, index
    }


    /* INTERIOR FUNCTION BLOCK */

    function enemyCollision( currentEnemy, index ) {

        for (let i = 0; i < friendlyBoundingBoxArr.length; i++) {
            enemyBoundingBoxArr[index].intersectsBox( friendlyBoundingBoxArr[i] ) && console.log('true')
        }
        // // since for some reason setFromMatrixPosition initializes with 0 0 0, there was a hit event at the very start. hence setTimeout
        // setTimeout(function() {
        //
        //     var enemyPos = new THREE.Vector3(); // THREE's distanceTo() is a method of Vector3(), so we need to use this
        //
        //     enemyPos.setFromMatrixPosition( currentEnemy.matrixWorld ); // updates world pos of enemy each frame
        //
        //     // distance is closer than the hitDistance and it's not been hit:
        //     if ( Math.floor( enemyPos.distanceTo( heroModel.position ) ) <= currentEnemy.userData.hitDistance && !currentEnemy.userData.hit ) {
        //         currentEnemy.userData.hit = true; // to avoid multiple hits
        //
        //         console.log(`\n==========\n ${currentEnemy.name} hit!\n==========`);
        //
        //         currentEnemy.userData.hitpoints -= heroModel.userData.dealsCollisionDamageAmount;
        //         heroModel.userData.hitpoints -= currentEnemy.userData.dealsCollisionDamageAmount;
        //
        //         console.log(`${currentEnemy.name} hitpoints now: ${currentEnemy.userData.hitpoints} `);
        //         console.log(`heroModel hitpoints now: ${heroModel.userData.hitpoints}`);
        //
        //         // If no more hitpoints or too far off screen
        //         if ( currentEnemy.userData.hitpoints <= 0 || currentEnemy.position.y < -1000 ) {
        //             destroy( currentEnemy, index );
        //         }
        //     }
        //     else if ( Math.floor( enemyPos.distanceTo( heroModel.position ) ) >= currentEnemy.userData.hitDistance && currentEnemy.userData.hit ) {
        //         // turn the hit counter back to false after we back off. possibly need to tune hitDistance / 2 or something
        //         currentEnemy.userData.hit = false;
        //         console.log(`currentEnemy.userData.hit: `, currentEnemy.userData.hit);
        //
        //         // hasCollided=true;
        //         // explode();
        //     }
        //
        // }, 1);
    }
}

function projectileBehaviour() {
    // if Projectiles exist
    if ( projectileArrFriendly.length > 0 ) {

        projectileArrFriendly.forEach( (projectile, idx) => {
            projectile.position.y += 10;

            // projectile.traverse( function( node ) {
            //     if ( node instanceof THREE.Mesh ) {
            //         console.log(`node.geometry.boundingSphere.intersectsSphere(  ): `, node.geometry.boundingSphere.intersectsSphere());
            //     }
            // });

            // enemyArr.forEach( (curEnemy, index) => {
            //
            //     console.log(`projectile: `, projectile);
            //     console.log(`curEnemy: `, curEnemy);
            //     // var enemyPos = new THREE.Vector3(); // THREE's distanceTo() is a method of Vector3(), so we need to use this
            //     // enemyPos.setFromMatrixPosition( curEnemy.matrixWorld ); // updates world pos of enemy each frame
            //
            //     if ( projectile.userData.boundingBox.intersectsBox( curEnemy.userData.boundingBox ) ) {
            //
            //         console.log(`\n==========\n ${curEnemy.name} hit!\n==========`);
            //
            //         // curEnemy.userData.hitpoints -= projectile.userData.dealsDamageAmount;
            //         //
            //         // console.log(`${curEnemy.name} hitpoints now: ${curEnemy.userData.hitpoints} `);
            //         //
            //         // // If no more hitpoints or too far off screen
            //         // if ( curEnemy.userData.hitpoints <= 0) {
            //         //     destroy( curEnemy, index );
            //         // }
            //     }
            // })
        })
    }
}

function destroy( actor, index ) {
    // enemyExplosion.emit();

    if ( actor == heroModel )   // if its myself
    {
        // no more steering
        document.removeEventListener('keydown', keybinds);

        // Death anim
        jetSmokeEmitterL.behaviours[3].a._arr[0] = {r: 1.0, g: 0.1, b: 0.1};    // changing this just makes it black
        jetSmokeEmitterR.behaviours[3].b._arr[0] = {r: 0.1, g: 0.1, b: 0.1};

        heroModel.position.z -= 2;
        heroModel.position.x += 4;
        heroModel.rotation.z -= 3 * Math.PI / 180;
        heroModel.rotation.y += 5 * Math.PI / 180;

        // pause
        setTimeout( ()=> {
            actor.visible = false;
            cancelAnimationFrame(animationFrameId);
        }, 2000 );
    }
    else
    {
        playerScore += actor.userData.pointsIfKilled;   // update playerScore
        enemyArr.splice(index, 1);
        console.log(`enemyArr: `, enemyArr);
        actor.visible = false;
    }

    // scene.remove is not working; so I hide it.
    // scene.remove(actor);

    console.log(`${actor.name} DEAD`);

    renderer.renderLists.dispose(); // prevents memory leaks
}
