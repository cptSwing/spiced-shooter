/* I DECLARE EVERYTHING IN HERE */

var scene, camera, cameraFrustum, cameraViewProjectionMatrix, HEIGHT, WIDTH, THREE, renderer, container, hemisphereLight, shadowLight, shadowLightHelper, shadowLightCameraHelper;
var heroModel, heroModelCollisionDamageOthers = 50;
var terrainScene;
var allGLTFLoaded = false;
var animationFrameId = null;
var enemyArr = [];
var projectileArrFriendly = [];
var proton, jetSmokeEmitterR, jetSmokeEmitterL, enemyExplosion;


/* CONTROLS: */
var transformSpeedMultiplier = 10;
var paused = false;

document.addEventListener('keydown', function(e) {
    if (e.code == 'ArrowUp') {
        heroModel.position.y += transformSpeedMultiplier * 1;
    }
    else if (e.code == 'ArrowDown') {
        heroModel.position.y -= transformSpeedMultiplier * 1;
    }
    else if (e.code == 'ArrowRight') {
        heroModel.position.x += transformSpeedMultiplier * 1;
    }
    else if (e.code == 'ArrowLeft') {
        heroModel.position.x -= transformSpeedMultiplier * 1;
    }
    else if (e.code == 'Pause') {
        if (!paused) {
            console.log(`Paused`);
            paused = !paused;
            cancelAnimationFrame(animationFrameId);
        } else {
            console.log(`Unpaused`);
            paused = !paused;
            // call anim again and collect new ID in the process
            animationFrameId = requestAnimationFrame( update );
        }

    }
});

/*************************/

init();

function init() {
    createScene();
    createLights();
    createParticles();
    createGeometry();
    createTerrain();
    createEnemies();
    checkIfDone(); // runs update
}


/* UPDATE function which runs every frame */
function update() {
    // scrolling..
    terrainScene.position.y -= 0.5;

    updateCameraMatrix();
    enemyCollision();

    // kind of a shitty way to have them follow each other, but them's the breaks
    jetSmokeEmitterR.p.x = heroModel.position.x + 20;
    jetSmokeEmitterR.p.y = heroModel.position.y - 22.5;

    jetSmokeEmitterL.p.x = heroModel.position.x - 20;
    jetSmokeEmitterL.p.y = heroModel.position.y - 22.5;


    // this we need. Because reasons.
    proton.update(clock.getDelta());
    Proton.Debug.renderInfo(proton, 3);

    animationFrameId = requestAnimationFrame( update );
    renderer.render( scene, camera );
}





/*************************/

function checkIfDone() {
    if (allGLTFLoaded) {
        console.log(`allGLTFLoaded: `, allGLTFLoaded);

        update();
    } else {    // check again in one second
        setTimeout(function() {
            console.log(`allGLTFLoaded: `, allGLTFLoaded);
            checkIfDone();
        }, 1000);
    }
}

function updateCameraMatrix() {
    // Not entirely sure what this does. Possibly this needs to watch the objects instead of updating the camera all the time?
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse( camera.matrixWorld );
    cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    cameraFrustum.setFromMatrix( cameraViewProjectionMatrix );

    // target the largest submeshes' boundingSphere
    // console.log(`cameraFrustum.intersectsObject ( heroModel ): `, cameraFrustum.intersectsObject ( heroModel.children[0].children[0] ));
}

function enemyCollision() {
    // since for some reason setFromMatrixPosition initializes with 0 0 0, there was a hit event at the very start. hence setTimeout
    setTimeout(function() {

        for (var i = 0; i < enemyArr.length; i++) {
            /** IN HERE I NEED TO UPDATE THE EXPLOSION PARTICLE EMITTERS TO BE SAME POS AS THE ENEMIES
            THEY WILL HAVE TO HAVE AN EMITTER CREATED THAT CORRESPONDS TO THEIR .name OR SIMILAR, for using with this loop **/


            // THREE's distanceTo() is a method of Vector3(), so we need to use this
            var enemyPos = new THREE.Vector3();

            // this updates the world position of the enemies each frame
            enemyPos.setFromMatrixPosition( enemyArr[i].matrixWorld );

            if ( Math.floor( enemyPos.distanceTo( heroModel.position ) ) <= enemyArr[i].userData.killDistance && !enemyArr[i].userData.hit ) {
                enemyArr[i].userData.hit = true; // to avoid multiple hits
                console.log(`\n==========\nhit!\n==========`);
                enemyArr[i].userData.hitpoints -= heroModelCollisionDamageOthers;
                console.log(`${enemyArr[i].name} hitpoints now: ${enemyArr[i].userData.hitpoints} `);

                if ( enemyArr[i].userData.hitpoints <= 0 ) {
                    console.log(`DEAD NME`);

                    enemyExplosion.emit();

                    // the following do NOT work for some goddamn reason
                    enemyArr[i].geometry.dispose();
                    enemyArr[i].material.dispose();
                    scene.remove( enemyArr[i] );
                    renderer.renderLists.dispose(); // prevents memory leaks

                    // so I hide it.
                    enemyArr[i].visible = false;

                    // and remove it from collision calculations at least. need to break out of the for loop or it will miss elements of array in next iteration
                    enemyArr.splice(i, 1);
                    console.log(`enemyArr: `, enemyArr);
                    break;
                }

            // turn the hit counter back to false after we back off. possibly need to tune killDistance / 2 or something
            } else if ( Math.floor( enemyPos.distanceTo( heroModel.position ) ) >= enemyArr[i].userData.killDistance && enemyArr[i].userData.hit ) {
                enemyArr[i].userData.hit = false;
                console.log(`enemyArr[i].userData.hit: `, enemyArr[i].userData.hit);
                // hasCollided=true;
                // explode();
            }

        }
    }, 10);
}

// orbit controls I use for debugging - mess with the viewport bounds though (re keyboardcontrol of hero)
// var orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = true;
