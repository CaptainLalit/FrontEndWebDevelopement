var player1Name, player2Name;
/*player1Name = prompt('Enter name of player 1 ');
player2Name = prompt('Enter name of player 2 ');
document.querySelector("#PlayerName1").innerHTML = player1Name;
document.querySelector("#PlayerName2").innerHTML = player2Name;*/


var score, roundScore, activePlayer, player1, player2;

score = [0, 0];
roundScore = 0;
activePlayer = 1;

player1 = document.getElementById("player-1");
player2 = document.getElementById("player-2");

var tsp1 = document.querySelector("#player-1 #totalScore");
tsp1.textContent = 0;

var csp1 = document.querySelector("#player-1 #currentScore");
csp1.textContent = 0;

var tsp2 = document.querySelector("#player-2 #totalScore");
tsp2.textContent = 0;

var csp2 = document.querySelector("#player-2 #currentScore");
csp2.textContent = 0;

document.querySelector("#Dice").style.display = "none";

document.querySelector("#dice").addEventListener('click', function() {
    //1.Random number
    var dice = Math.floor(Math.random() * 6) + 1;
    
    //2. Display the result
    var rollDice = document.querySelector("#diceNumber");
    document.querySelector("#Dice").style.display = "block";
    rollDice.src = "dice-" + dice + ".png";
    
    //3. Update current score of active player, if dice value is equal to 1 then make current score 0 and change the player
    if (dice == 1) {
        if (activePlayer == 1) {
            csp1.textContent = "0";
            activePlayer = 2;
            player1.style.backgroundColor = "rgba( 198, 183, 183, 0 )";
            player2.style.backgroundColor = "rgba( 198, 183, 183, 0.483 )";
            //rollDice.src = "dice-" + 0 + ".png";
        }
        else {
            csp2.textContent = "0";
            activePlayer = 1; 
            player2.style.backgroundColor = "rgba( 198, 183, 183, 0 )";
            player1.style.backgroundColor = "rgba( 198, 183, 183, 0.483 )";
            //rollDice.src = "dice-" + 0 + ".png";
        }
        roundScore = 0;
    }
    else {
        roundScore += dice;
        if(activePlayer == 1) {
            csp1.textContent = roundScore;
        }
        else {
            csp2.textContent = roundScore;
        }
    }
    
    //4. If total score is greater than or equal to 100 then the active player wins
    if (score[activePlayer - 1] + roundScore >= 100) {
        var winner = document.querySelector("#PlayerName" + activePlayer);
        winner.style.color = "#ef0f0f";
        winner.textContent = "WINNER";
        var reset = document.querySelector("#reset");
        reset.style.display = "block";
        reset.innerHTML += "Player " + activePlayer + " wins <br/ >RESET GAME";
        if (activePlayer === 1) {
           tsp1.textContent =  score[0] + roundScore;
        }
        else {
            tsp2.textContent = score[1] + roundScore;
        }
    }
    
});

document.querySelector("#changeTurn").addEventListener('click', function() {
    //1. Updating total score
    score[activePlayer - 1] += roundScore;
    roundScore = 0;
    document.querySelector("#player-" + activePlayer + " #totalScore").textContent = score[activePlayer - 1];
    
    //2. Changin active player
    if (activePlayer === 1) {
        csp1.textContent = "0";
        activePlayer = 2;
        player1.style.backgroundColor = "rgba( 198, 183, 183, 0 )";
        player2.style.backgroundColor = "rgba( 198, 183, 183, 0.483 )";
        rollDice.src = "dice-" + 0 + ".png";
    }
    else {
        csp2.textContent = "0";
        activePlayer = 1; 
        player2.style.backgroundColor = "rgba( 198, 183, 183, 0 )";
        player1.style.backgroundColor = "rgba( 198, 183, 183, 0.483 )";
        rollDice.src = "dice-" + 0 + ".png";
    }
});


//Reseting the game to its initial condition
document.querySelector("#reset").addEventListener('click', function() {
    //1. Setting name to default
    var winner = document.querySelector("#PlayerName" + activePlayer);
    winner.style.color = "black";
    winner.textContent = "PLAYER " + activePlayer;
    
    //2. Setting all variables to initial value
    score = [0, 0];
    roundScore = 0;
    activePlayer = 1;
    tsp1.textContent = "0";
    tsp2.textContent = "0";
    csp1.textContent = "0";
    csp2.textContent = "0";
    player1.style.backgroundColor = "rgba( 198, 183, 183, 0.483 )";
    player2.style.backgroundColor = "rgba( 198, 183, 183, 0 )";
    document.querySelector("#Dice").style.display = "none";
    //3. Hiding reset button
    var reset = document.getElementById("reset");
    reset.style.display = "none";
    reset.innerHTML = "Game Over ";
});






