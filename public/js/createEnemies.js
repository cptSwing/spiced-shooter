// Tring to build a Constructor here for Enemies..!
function createEnemies() {

    function Enemy() {
        var enGeo = new THREE.BoxGeometry( 100, 100, 100 );
        var enMat = new THREE.MeshStandardMaterial( { color: 0xFFAA00, metalness: 0 } );
        var en = new THREE.Mesh( enGeo, enMat );
        en.hitpoints = 100;
        en.killDistance = 50;
        en.hit = false;
        // en.rotation.x = Math.random;
        return en;
    }

    function addEnemy(EnemyConstructor, posXY) {
        var enemy = new EnemyConstructor;
        enemy.position.set(posXY[0], posXY[1], 0);
        // add to the terrainScene in order for it to scroll downwards
        terrainScene.add(enemy);
        enemyArr.push(enemy);
    }


    addEnemy(Enemy, [0, 500]);
    addEnemy(Enemy, [-200, 750]);
    addEnemy(Enemy, [0, 1000]);
}
