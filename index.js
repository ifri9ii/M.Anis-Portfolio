/* =====================================================
   DARK / LIGHT MODE
===================================================== */

const themeButton = document.getElementById("theme-toggle");

if (themeButton) {

    // Get saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeButton.textContent = "☀️";
    }

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        if (isLight) {

            themeButton.textContent = "☀️";
            localStorage.setItem("theme", "light");

        } else {

            themeButton.textContent = "🌙";
            localStorage.setItem("theme", "dark");

        }

    });
}


/* =====================================================
   DICE GAME
===================================================== */

const rollButton = document.getElementById("rollButton");

const resetDiceButton =
    document.getElementById("reset-dice");

const dice1 =
    document.getElementById("dice1");

const dice2 =
    document.getElementById("dice2");

const diceResult =
    document.getElementById("dice-result");


/*
    Roll Dice
*/

if (rollButton) {

    rollButton.addEventListener("click", function () {

        // Random number between 1 and 6
        const randomNumber1 =
            Math.floor(Math.random() * 6) + 1;

        const randomNumber2 =
            Math.floor(Math.random() * 6) + 1;


        // Change dice
        dice1.className =
            "dice dice-" + randomNumber1;

        dice2.className =
            "dice dice-" + randomNumber2;


        // Animation
        dice1.classList.add("roll-animation");
        dice2.classList.add("roll-animation");


        setTimeout(function () {

            dice1.classList.remove("roll-animation");
            dice2.classList.remove("roll-animation");

        }, 400);


        // Check winner
        if (randomNumber1 > randomNumber2) {

            diceResult.textContent =
                "🎉 You Win!";

        }

        else if (randomNumber2 > randomNumber1) {

            diceResult.textContent =
                "🤖 Player 2 Wins!";

        }

        else {

            diceResult.textContent =
                "🤝 It's a Draw!";

        }

    });

}


/*
    Reset Dice
*/

if (resetDiceButton) {

    resetDiceButton.addEventListener("click", function () {

        dice1.className = "dice dice-1";

        dice2.className = "dice dice-1";

        diceResult.textContent =
            "Roll Dice to Begin!";

    });

}


/* =====================================================
   SIMON SAYS GAME
===================================================== */

const simonButtons =
    document.querySelectorAll(".simon-button");

const startSimonButton =
    document.getElementById("start-simon");

const resetSimonButton =
    document.getElementById("reset-simon");

const levelElement =
    document.getElementById("level");

const scoreElement =
    document.getElementById("simon-score");

const simonMessage =
    document.getElementById("simon-message");


/*
    Game variables
*/

let gameSequence = [];

let userSequence = [];

let level = 0;

let score = 0;

let gameStarted = false;

let acceptingInput = false;


/*
    Available colors
*/

const colors = [
    "green",
    "red",
    "yellow",
    "blue"
];


/* =====================================================
   START SIMON GAME
===================================================== */

function startSimonGame() {

    gameSequence = [];

    userSequence = [];

    level = 0;

    score = 0;

    gameStarted = true;

    acceptingInput = false;


    updateSimonDisplay();


    simonMessage.textContent =
        "Watch the sequence...";


    nextLevel();
}


/* =====================================================
   NEXT LEVEL
===================================================== */

function nextLevel() {

    userSequence = [];

    level++;

    updateSimonDisplay();


    // Generate random color
    const randomIndex =
        Math.floor(Math.random() * colors.length);

    const randomColor =
        colors[randomIndex];


    // Add color to sequence
    gameSequence.push(randomColor);


    // Wait before playing
    setTimeout(function () {

        playSequence();

    }, 500);
}


/* =====================================================
   PLAY SEQUENCE
===================================================== */

function playSequence() {

    acceptingInput = false;

    let index = 0;


    const interval =
        setInterval(function () {

            const color =
                gameSequence[index];


            flashButton(color);

            index++;


            if (index >= gameSequence.length) {

                clearInterval(interval);


                setTimeout(function () {

                    acceptingInput = true;

                    simonMessage.textContent =
                        "Your turn!";

                }, 500);

            }

        }, 700);
}


/* =====================================================
   FLASH BUTTON
===================================================== */

function flashButton(color) {

    const button =
        document.querySelector(
            `.simon-button[data-color="${color}"]`
        );


    if (!button) {
        return;
    }


    button.classList.add("active");


    setTimeout(function () {

        button.classList.remove("active");

    }, 350);
}


/* =====================================================
   SIMON BUTTON CLICK
===================================================== */

simonButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        /*
            If game hasn't started,
            start it.
        */

        if (!gameStarted) {

            startSimonGame();

            return;

        }


        /*
            Don't allow clicks
            while sequence is playing.
        */

        if (!acceptingInput) {

            return;

        }


        const selectedColor =
            button.dataset.color;


        userSequence.push(selectedColor);


        flashButton(selectedColor);


        /*
            Check user's answer
        */

        const currentIndex =
            userSequence.length - 1;


        if (
            userSequence[currentIndex] !==
            gameSequence[currentIndex]
        ) {

            gameOver();

            return;

        }


        /*
            User completed
            the sequence correctly.
        */

        if (
            userSequence.length ===
            gameSequence.length
        ) {

            score += level * 10;

            updateSimonDisplay();

            simonMessage.textContent =
                "✅ Correct! Next level...";


            acceptingInput = false;


            setTimeout(function () {

                nextLevel();

            }, 900);

        }

    });

});


/* =====================================================
   START BUTTON
===================================================== */

if (startSimonButton) {

    startSimonButton.addEventListener(
        "click",
        function () {

            startSimonGame();

        }
    );

}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    acceptingInput = false;

    gameStarted = false;


    simonMessage.textContent =
        "❌ Game Over! Score: " + score;


    /*
        Flash all buttons
    */

    simonButtons.forEach(function (button) {

        button.classList.add("active");

    });


    setTimeout(function () {

        simonButtons.forEach(function (button) {

            button.classList.remove("active");

        });

    }, 500);
}


/* =====================================================
   RESET SIMON
===================================================== */

if (resetSimonButton) {

    resetSimonButton.addEventListener(
        "click",
        function () {

            gameSequence = [];

            userSequence = [];

            level = 0;

            score = 0;

            gameStarted = false;

            acceptingInput = false;


            updateSimonDisplay();


            simonMessage.textContent =
                "Click Start Game to Play";

        }
    );

}


/* =====================================================
   UPDATE SIMON DISPLAY
===================================================== */

function updateSimonDisplay() {

    if (levelElement) {

        levelElement.textContent =
            level;

    }


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }

}


/* =====================================================
   PRESS ANY KEY TO START
===================================================== */

document.addEventListener("keydown", function () {

    if (!gameStarted) {

        startSimonGame();

    }

});
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

           
            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}