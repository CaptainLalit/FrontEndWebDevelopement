var scoreController = (function() {
    var score, hearts;
    
    return {
        intialisingVar: function() {
            score = 0;
            hearts = 3;
        },
        
        getVar: function() {
            return {
                scr: score,
                lifes: hearts
            }
        },
        
        increaseScore: function() {
            score += 1;
            return score;
        },
        
        updateHearts: function() {
            hearts -= 1;
            return hearts;
        },
        
        getTotalScore: function() {
            return score;
        },
        
        gameOver: function() {
            hearts = 0;
        }
    }
})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var uiController = (function() {           
    var DOMstrings, fruits, noOfFruits = 9 - 1;
    fruits = ['apple', 'banana', 'pineapple', 'cherry', 'orange', 'bomb', 'mango', 'peach', 'grapes'];
    DOMstrings= {
        heart: '.trials',
        score: '.score',
        start: '.start-reset',
        catch: '.catch',
        fruitContainer: '.fruit-box',
        resetBtn: '.reset',
        startBtn: '.start',
        fruit: '.fruit',
        finalScore: '.finalScore',
        finalScoreValue: '#finalScoreValue',
        sliceSound: '#SliceSound',
        backgroundMusic: '#backgroundMusic',
        pauseMusic: '.pauseMusic'
    };
    
    return {
        getStrings: function() {
            return DOMstrings;  
        },
        
        // Updating the hearts
        updateHerat: function(num) {
           document.querySelector(DOMstrings.heart).innerHTML = "";
            for(var i = 0; i < num ; i++) {
                $(DOMstrings.heart).append('<img src = "Images/heart.png">');
            }
        },
        
        // Updating the score
        updateScore: function(score) {
            document.querySelector(DOMstrings.score).innerHTML = 'Score : ' + score;
        },
        
        // Generating random fruit with random position
        generateRandomFruit: function() {
            var Fruit, x;
            x = Math.round(noOfFruits * Math.random());
            Fruit = $(DOMstrings.fruit);
            Fruit.attr('src', 'Images/' + fruits[x] + '.png');
            Fruit.css({
                left: Math.round(Math.random() * 75) + '%',
                top: '-200px'
                
            });
            if (fruits[x] === 'bomb') {
                return true;
            } else {
                return false;
            }
        },
        
        moveFruit: function(y) {
            $(DOMstrings.fruit).css('top',($(DOMstrings.fruit).position().top + y) + 'px');    
        }
    }
})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var controller = (function(uiCtrl, scrCtrl) {
    var score, Strings, interval, isBomb = false;
    
    Strings = uiCtrl.getStrings();
    
    
    // Initialising all the functions
    function start() {
        
        // Displaying the hidden objects
        $(Strings.catch).show();
        $(Strings.resetBtn).show();
        $(Strings.score).show();
        $(Strings.heart).show();
        
        // Hiding the elements
        $(Strings.startBtn).hide();
        
        // Intialising the score
        uiCtrl.updateScore(0);
        
        // Intialising the hearts
        uiCtrl.updateHerat(3);
        
        // Adding Event to catch fruits button
        document.querySelector(Strings.catch).addEventListener('click', startGame);
        
        //Adding Event listner to reset button
        document.querySelector(Strings.resetBtn).addEventListener('click', resetGame);
    };

     // Game Over
    function gameOver() {
        // Stoping the background music
        $(Strings.pauseMusic).hide();
        $(Strings.backgroundMusic)[0].pause();
        
        // Updating the final score in ui
        document.querySelector(Strings.finalScoreValue).innerHTML = 'Your score is ' + scrCtrl.getTotalScore(); 
        
        // Displaying final score
        $(Strings.finalScore).show(600);
        // Hiding the hearts and fruit
        $(Strings.heart).hide();
        $(Strings.fruit).hide();
    };
    
    // Starting the game
    function startGame() {
        $(Strings.pauseMusic).show();
        
        // Playing background music
        $(Strings.backgroundMusic)[0].play();
        
        // Hiding the catch fruit button
        $(Strings.catch).hide();
        
        // Intialising the variables
        scrCtrl.intialisingVar();
        
        // Setting the mouseover listner on fruits
        $(Strings.fruit).mouseover(function() {
                clearInterval(interval);
                $(Strings.fruit).hide(450);    
                $(Strings.sliceSound)[0].play();
                
                if (isBomb === true) {
                    // Game over   
                    scrCtrl.gameOver();
                    gameOver();
                } else {
                score = scrCtrl.increaseScore();
                uiCtrl.updateScore(score);

                // Generating new fruit
                setTimeout(generateFruits, 500);
            }
        });
        
        generateFruits();
    };
    
    function generateFruits() {
        var speed, score;
        
        $(Strings.fruit).show();
        
        // Generating a random fruit
        isBomb = uiCtrl.generateRandomFruit();
        
        // Random speed
        speed = Math.round(3 * Math.random()) + 2;
        
        // Moving the fruit
        interval = setInterval(function() {
            
            uiCtrl.moveFruit(speed);
            // Is fruit too low
            isFruitTooLow();
        }, 10);
    }
    
    // Checking is fruit too flow
    function isFruitTooLow() {
        var remainingHearts;
        if ($(Strings.fruit).position().top >= $(Strings.fruitContainer).height()) {
                clearInterval(interval);
            
                // If fruit is not a bomb then decrease the heart by 1
                if (isBomb == false) {
                    remainingHearts = scrCtrl.updateHearts();
                    uiCtrl.updateHerat(remainingHearts);
                }
            
                // Is any heart remaining if not then game over else generate new fruit
                if( remainingHearts <= 0) {
                    gameOver();
                } else {
                    generateFruits();
                }
            }
    };
    
    
    // Reset Game
    function resetGame() {
        // Reloading the page
        location.reload();      
    };
    
    return {
        init: function() {
             document.querySelector(Strings.start).addEventListener('click', start);
        }
    }
    
})(uiController, scoreController);


// Starting the game
controller.init();