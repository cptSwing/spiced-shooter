/* eslint no-undef: 0 */

var transformSpeedMultiplier = 10;
var paused = true;

var menuSelector = document.getElementById('menu');
var menuContentChildrenIndex = 0;


document.addEventListener('keydown', keybinds);


function keybinds(e) {
    console.log(`e.code: `, e.code);
    if (paused) {

        if (e.code == 'ArrowDown') {
            menuContentChildren[menuContentChildrenIndex].classList.remove('menu_content_children_active');
            menuContentChildrenIndex++;

            if (menuContentChildrenIndex >= menuContentChildren.length) {
                menuContentChildrenIndex = 0;
            }

            menuContentChildren[menuContentChildrenIndex].classList.add('menu_content_children_active');
        }

        else if (e.code == 'Enter') {
            if (menuContentChildrenIndex == 0) {    // Start
                paused = false;
                menuSelector.style.visibility = 'hidden';

                // hacky way of seeing if we need to fully restart or not
                if (heroModel.userData.hitpoints > 0) {
                    update();
                } else {
                    window.location.reload(false);
                }

            }
            else if (menuContentChildrenIndex == 2) { // HIGHSCORES
                menuContent.innerHTML = `
                    <div class="highscores">
                        <span>&#9825; Shilpa &#9825;</span>
                        <span>1,000,001</span>
                    </div>
                    <div class="highscores">
                        <span>David</span>
                        <span>1,000,000</span><David
                    </div>
                    <div class="highscores">
                        <span>Ivana</span>
                        <span>1,000,000</span>
                    </div>
                    <div class="highscores">
                        <span>Ryan</span>
                        <span>1,000,000</span>
                    </div>
                    <div class="highscores">
                        <span>&#9773; Jens &#9773;</span>
                        <span>1,000,000</span>
                    </div>
                `;
            }
            else if (menuContentChildrenIndex == 3) { // EXIT
                window.location = "https://youtu.be/00eLTQwBH4I?t=40";
            }
        }

        else if (e.code == 'Escape') {
            // re-add start menu
            menuContent.innerHTML = `
                <div class="menu_content_children_active">START GAME</div>
                <div>SETTINGS</div>
                <div>VIEW HIGHSCORES</div>
                <div>EXIT GAME</div>
            `;
            menuContentChildren = document.querySelectorAll('#menu_content > div'); // update array with the above
            menuContentChildren[menuContentChildrenIndex].classList.remove('menu_content_children_active');
            menuContentChildrenIndex = 0;
            menuContentChildren[menuContentChildrenIndex].classList.add('menu_content_children_active');

        }
    }

    else {

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

}
