var transformSpeedMultiplier = 10;
var paused = false;

var menuSelector = document.getElementById('menu');

document.addEventListener('keydown', keybinds);


function keybinds(e) {
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

    else if (e.code == 'Space') {
        shootLasers();
    }

    else if (e.code == 'Pause') {
        if (!paused) {
            console.log(`Paused`);
            paused = !paused;
            menuSelector.style.visibility = 'visible';
            cancelAnimationFrame(animationFrameId);
        }
        else {
            console.log(`Unpaused`);
            paused = !paused;
            menuSelector.style.visibility = 'hidden';
            // call anim again and collect new ID in the process
            animationFrameId = requestAnimationFrame( update );
        }
    }
}
