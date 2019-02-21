var proton, jetSmokeEmitterR, jetSmokeEmitterL, enemyExplosion;

function createParticles() {
    proton = new Proton();

    jetSmokeEmitterR = createJet('jetSmokeEmitterR');
    jetSmokeEmitterL = createJet('jetSmokeEmitterL');

    enemyExplosion = createExplosion('enemyExplosion')

    //add Emitters
    proton.addEmitter(jetSmokeEmitterR);
    proton.addEmitter(jetSmokeEmitterL);
    proton.addEmitter(enemyExplosion);

    //add renderer
    proton.addRender(new Proton.SpriteRender(scene));
}

function createJet(name) {
    jet = new Proton.Emitter();

    // setRate -> number of emissions, emission event every n second?
    // jet.rate = new Proton.Rate(new Proton.Span(10, 15), new Proton.Span(0.005));
    jet.rate = new Proton.Rate(10, .0001);


    //addInitialize
    jet.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
    jet.addInitialize(new Proton.Radius(1, 10)); // start small, get very large. possibly good for explosions
    jet.addInitialize(new Proton.Life(0, 1.5)); // lifecycle length -> start and end. good for smoketrails possibly, if long life
    jet.addInitialize(new Proton.V(2.5, new Proton.Vector3D(0, 1, 0), 180)); // radius, vector (), tha (something angle??)
    // not having a velocity looks like a good ray

    //addBehaviour
    jet.addBehaviour(new Proton.Alpha(0.75, 0));
    jet.addBehaviour(new Proton.Scale(.25, 1.5));
    jet.addBehaviour(new Proton.Force(0, -2, 0)); // fx, fy, life (this pushes upwards or downward)

    var color1 = new THREE.Color("rgb(219, 190, 36)");
    var color2 = new THREE.Color("rgb(78, 63, 63)");

    var colorBehaviour = new Proton.Color(color1, color2);
    jet.addBehaviour(colorBehaviour);

    jet.p.x = 0;
    jet.p.y = 0;
    jet.p.z = 2;

    jet.name = name;

    jet.emit();
    return jet;
}


function createExplosion(name) {
    explosion = new Proton.Emitter();

    // setRate -> number of emissions, emission event every n second?
    explosion.rate = new Proton.Rate(new Proton.Span(1, 20), new Proton.Span(0.01));

    //addInitialize
    explosion.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
    explosion.addInitialize(new Proton.Radius(1, 10)); // start small, get very large. possibly good for explosions
    explosion.addInitialize(new Proton.Life(0, 2.5)); // lifecycle length -> start and end. good for smoketrails possibly, if long life
    explosion.addInitialize(new Proton.V(20, new Proton.Vector3D(0, 1, 0), 180)); // radius, vector (), tha (something angle??)
    // not having a velocity looks like a good ray

    //addBehaviour
    explosion.addBehaviour(new Proton.Alpha(0.75, 0));
    explosion.addBehaviour(new Proton.Scale(.125, 2));
    // explosion.addBehaviour(new Proton.Force(0, -2.5, 0)); // fx, fy, life (this pushes upwards or downward)

    var color1 = new THREE.Color("rgb(250, 0, 0)");
    var color2 = new THREE.Color("rgb(80, 80, 80)");

    var colorBehaviour = new Proton.Color(color1, color2);
    explosion.addBehaviour(colorBehaviour);

    explosion.name = name;

    // explosion.emit();
    return explosion;
}

// jet.addInitialize(new Proton.Mass(1)); // I assume this is not needed without Gravity
