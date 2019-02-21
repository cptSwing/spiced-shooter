// /* eslint-disable */
/* eslint no-undef: 0 */

var projectileArrFriendly = [];
var playerScore = 0;
var playerHealthElement = document.getElementById('player_health');
var playerScoreElement = document.getElementById('player_score');
var gameStarted = false;

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
    friendlyArr.length > 1 && projectileBehaviour();

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

/** THE FOLLOWING ARE CALLED EACH FRAME **/
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

    // update bounding box helper and hence bounding box for translations. hero is always index 0
    friendlyBoundingBoxHelpersArr[0].update();
    friendlyBoundingBoxArr[0].setFromObject(friendlyBoundingBoxHelpersArr[0]);

    // kind of a shitty way to have them follow each other, but them's the breaks
    jetSmokeEmitterR.p.x = heroModel.position.x + 20;
    jetSmokeEmitterR.p.y = heroModel.position.y - 22.5;
    jetSmokeEmitterR.p.z = heroModel.position.z;

    jetSmokeEmitterL.p.x = heroModel.position.x - 20;
    jetSmokeEmitterL.p.y = heroModel.position.y - 22.5;
    jetSmokeEmitterL.p.z = heroModel.position.z;

    // have our outlinemesh follow us
    heroModeloutlineMesh.position.x = heroModel.position.x;
    heroModeloutlineMesh.position.y = heroModel.position.y;

    // update health and score display
    playerHealthElement.innerHTML = heroModel.userData.hitpoints;
    playerScoreElement.innerHTML = playerScore;

    // dead:
    if ( heroModel.userData.hitpoints <= 0 ) {
        destroy( heroModel, null );
    }
}

function enemyBehaviour() {

    // update our bounding box helpers, re-get bounding boxes from them
    for (let i = 0; i < enemyBoundingBoxHelpersArr.length; i++) {
        enemyBoundingBoxHelpersArr[i].update();
        enemyBoundingBoxArr[i].setFromObject(enemyBoundingBoxHelpersArr[i]);
    }

    // loop through all enemies in our array. Don't want to repeat this, so jam anything in here
    for (let i = 0; i < enemyArr.length; i++) {
        var currentEnemy = enemyArr[i]; // easier

        // rotating the propellors
        currentEnemy.children[0].children[0].children[1].rotation.x -= 50;

        enemyCollision( currentEnemy, i );

        // if either killed by me, or too far down offscreen (the latter needs a worldPos, since enemies are parented to terrain)
        let worldVec = new THREE.Vector3();
        if ( currentEnemy.userData.hitpoints <= 0 || currentEnemy.getWorldPosition(worldVec).y < -500 ) {
            destroy( currentEnemy, i );
        }
    }

    /* INTERIOR FUNCTION BLOCK */
    function enemyCollision( currentEnemy, index ) {

        // looping through the array of "other" actors to see who currentEnemy got hit by
        for (let i = 0; i < friendlyBoundingBoxArr.length; i++) {

            // current enemy intersects hero or laser, and it's been a while since the last time (userData.hit)
            if ( enemyBoundingBoxArr[index].intersectsBox( friendlyBoundingBoxArr[i] ) && !currentEnemy.userData.hit ) {

                /** HEROMODEL COLLISION (IT'S ALWAYS AT INDEX 0) **/
                if ( i === 0 ) {

                    currentEnemy.userData.hitpoints -= heroModel.userData.dealsCollisionDamageAmount;
                    currentEnemy.userData.hit = true;
                    setTimeout( () => { // set back to 'hittable' after a certain time
                        currentEnemy.userData.hit = false;
                    }, 1000);

                    heroModel.userData.hitpoints -= currentEnemy.userData.dealsCollisionDamageAmount;

                    // randomly bounce hero off enemy and blinking outline
                    randPos = ( Math.floor( (Math.random() * 75) +50 ) );   // rnd value between 75 and 50
                    var randPlusOrMinus = Math.random() < 0.5 ? -1 : 1; // if lower than 0.5 then negative..
                    randPos = randPos * randPlusOrMinus;
                    heroModel.position.y += randPos;
                    heroModel.position.x += randPos;

                    showOutline();

                    // camera shake?

                    // console.log(`I (${index}) was hit by Player! My hitpoints: ${currentEnemy.userData.hitpoints}. My BoundinBoxHelper: `, enemyBoundingBoxHelpersArr[index]);
                }

                /** LASER HIT **/
                else {

                    currentEnemy.userData.hitpoints -= laserBeamR1.userData.dealsDamageAmount;
                    currentEnemy.userData.hit = true;

                    let currentEnemyWorldVec = new THREE.Vector3();
                    console.log(`currentEnemy.getWorldPosition(currentEnemyWorldVec): `, currentEnemy.getWorldPosition(currentEnemyWorldVec));

                    var explosionCurrentEnemy = createFinalExplosion(`enemyExplosion${index}`)
                    proton.addEmitter(explosionCurrentEnemy);

                    explosionCurrentEnemy.p.x = currentEnemyWorldVec.x;
                    explosionCurrentEnemy.p.y = currentEnemyWorldVec.y;
                    explosionCurrentEnemy.p.z = currentEnemyWorldVec.z;

                    explosionCurrentEnemy.emit();
                    const explosionCurrentEnemyArrIndex = explosionArray.push(explosionCurrentEnemy) - 1; // returns new length, so index is one down

                    setTimeout( () => {
                        explosionCurrentEnemy.destroy();
                        explosionArray.splice( explosionCurrentEnemyArrIndex, 1 );
                        console.log(`explosionArray: `, explosionArray);
                    }, 500)

                    setTimeout( () => { // set back to 'hittable' after a certain time
                        currentEnemy.userData.hit = false;
                    }, 1000);
                }
            }
        }
    }
}

function projectileBehaviour() {

    for (let i = 1; i < friendlyArr.length; i++ ) {
        friendlyArr[i].position.y += 10;

        friendlyBoundingBoxHelpersArr[i].update();
        friendlyBoundingBoxArr[i].setFromObject( friendlyBoundingBoxHelpersArr[i] );

        // if too far up offscreen
        if ( friendlyArr[i].position.y > 1500 ) {
            friendlyArr.splice(i, 1);
            friendlyBoundingBoxHelpersArr.splice(i, 1);
            friendlyBoundingBoxArr.splice(i, 1);

            friendlyArr[i].visible = false;
            scene.remove( friendlyBoundingBoxHelpersArr[i] );
            scene.remove( friendlyArr[i] );
            console.log(`friendlyArr: `, friendlyArr);
        }
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

        // pause after crashing and burning
        setTimeout( ()=> {
            actor.visible = false;
            cancelAnimationFrame(animationFrameId);
        }, 2000 );
    }
    else    // it's an enemy
    {
        playerScore += actor.userData.pointsIfKilled;   // update playerScore


        // // trying to keep the array numbering intact:
        // enemyArr[index] = null;
        // enemyBoundingBoxHelpersArr[index] = null;
        // enemyBoundingBoxArr[index] = null

        enemyArr.splice(index, 1);  // remove from array of enemies
        enemyBoundingBoxHelpersArr.splice(index, 1);
        enemyBoundingBoxArr.splice(index, 1);

        actor.visible = false;
        scene.remove( enemyBoundingBoxHelpersArr[index] );
        scene.remove( actor );

        console.log(`enemyArr, enemyBoundingBoxHelpersArr: `, enemyArr, enemyBoundingBoxHelpersArr);

    }

    // scene.remove is not working; so I hide it.

    console.log(`${actor.name} DEAD`);

    renderer.renderLists.dispose(); // prevents memory leaks
}

function showOutline() {
    if ( heroModel.userData.hitpoints > 0 ) {
        var blinkCounter = 0;

        heroModeloutlineMesh.visible = true;
        heroModel.visible = false;

        blinkLoop();

        function blinkLoop() {
            if (blinkCounter <= 10) {
                heroModeloutlineMesh.visible = !heroModeloutlineMesh.visible;
                heroModel.visible = !heroModel.visible;
                blinkCounter++;

                setTimeout( blinkLoop, 75);
            } else {
                heroModeloutlineMesh.visible = false;
                heroModel.visible = true;
            }
        }
    }
}
