// Going into this HW assignment, I assumed this would be the easiest thus far. Yea, that was incorrect... 
// relied on some outside help on this one, specifically my dev brother as I was having trouble linking the timer
// and verifying responses. 


// Sounds files ----------------------------------
var clickSound = new Audio("assets/sound/button.mp3");
var correctSound = new Audio("assets/sound/correct.mp3");
var incorrectSound = new Audio("assets/sound/incorrect.mp3");

// Blank global variables  ------------------------------
var currentQuestion; 
var correctAnswer; 
var incorrectAnswer; 
var unanswered; 
var seconds; 
var time; 
var answered; 
var userSelect;

// Array variables --------------------------------
var imageArray = ['brazil', 'germany', 'china', 'usa', 'japan', 'sudan', 'singapore', 'scotland', 'egypt', 'nepal'];
var messages = {correct: "Bingo!", incorrect: "Nope.", timeUp: "Sorry.... too slow!", finished: "And the final tallies are: "}

var questionBank = [
	{question: "Which country is the largest exporter of coffee?",
	multipleChoice: ["United States", "Brazil", "Colombia", "Ethiopia"],
	answer: 1}
,
	{question: "The largest Zoo in the world is located in what country?",
	multipleChoice: ["Germany", "United States", "Australia", "China"],
	answer: 0}
,
	{question: "Half of all pigs on earth live in what country?",
	multipleChoice: ["United States", "Mexico", "China", "Russia"],
	answer: 2}
,
	{question: "Which country has the highest divorce rates in the world?",
	multipleChoice: ["England", "Canada", "United States", "Australia"],
	answer: 2}
,
	{question: "Which 1st world country is dealing with the largest case of negative population growth?",
	multipleChoice: ["Italy", "Canada", "Sweden", "Japan"],
	answer: 3}
,
	{question: "This country has more than 200 pyramids. Hint: its not your first guess!",
	multipleChoice: ["Sudan", "Jordan", "Libya", "Egypt"],
	answer: 0}
,
	{question: "The sale and import of chewing gum is banned in what country?",
	multipleChoice: ["Japan", "Singapore", "Malaysia", "Vatican City"],
	answer: 1}
,
	{question: "This sovereign state enlists the unicorn as its official animal.",
	multipleChoice: ["Cyprus", "Luxembourg", "Portugal", "Scotland"],
	answer: 3}
,
	{question: "The oldest of the Seven Wonders of the World is located in this country",
	multipleChoice: ["Egypt", "China", "Greece", "Iraq"],
	answer: 0}
,
	{question: "Which Asian country has the only non-rectangular flag in the world?",
	multipleChoice: ["Myanmar", "Nepal", "Brunei", "Bhutan"],
	answer: 1}
];

// Game Start ----------------------------------

$('#startBtn').on('click', function() {							// hide button on click
    clickSound.play();
	$(this).hide();
	startGame();
});

$('#startOverBtn').on('click', function() {						// same as start, just a reset
    clickSound.play();
	$(this).hide();
	startGame();
});

function startGame() {                                             
    currentQuestion = 0;										// set scores to 0
	correctAnswer = 0;
	incorrectAnswer = 0;
	unanswered = 0;
    
    $('#resultsMessage').empty();                               // clear out all divs with recorded game values
	$('#correctAnswers').empty();
	$('#incorrectAnswers').empty();
	$('#unanswered').empty();
	
	newQuestion();
}

function timer() {                                                                      // create timer
	seconds = 15;
	$('#timeLeft').html('<h2>Time Remaining: ' + seconds + '</h2>');                    // print to div
	answered = true;                                                                        
	time = setInterval(printTimer, 1000);                                               // 1 sec delay
}

function printTimer() {
	seconds--;                                                                              
	$('#timeLeft').html('<h2>Time Remaining: ' + seconds + '</h2>');                        // print timer to page
	if(seconds < 1){
		clearInterval(time);                                                                // stops timer at 0
		answered = false;                                                                   // counts as unanswered question if timer hits 0.
		checkAnswer();                                                                      
	}
}

function newQuestion() {
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#image').empty();
	answered = true;
	
	//sets up new questions & multipleChoice
	$('#currentQuestion').html('Question #'+(currentQuestion+1)+'/'+questionBank.length);   // +1 to remove 0 spot of array
	$('.question').html('<h2>' + questionBank[currentQuestion].question + '</h2>');         // print question to div
	for(var i = 0; i < 4; i++){                                                             // iterate through possible answers 1-4
        
        var choices = $('<div>');                                                           // assign blank div to variable choices
        
        choices.text(questionBank[currentQuestion].multipleChoice[i]);                      // assign multiple choice answers to the new variable
		choices.attr({'data-index': i });                                                   // assign new iterative attribute
		choices.addClass('thisChoice');                                                     // assign new class 
        
        $('.multipleChoice').append(choices);                                               // print answers to div
    }
    
	timer();
	$('.thisChoice').on('click',function(){                                                 // use the new class as new on click capture
        clickSound.play();
		userSelect = $(this).data('index');                                                 // assigns a new data element to the answer just chosen
		clearInterval(time);                                                                // stops timer
		checkAnswer();                                                                      // call / load checkAnswer function
	});
}



function checkAnswer() {
	$('#currentQuestion').empty();                                                          // removes question and choices to clean up area
	$('.thisChoice').empty(); 
	$('.question').empty();

	var rightAnswerText = questionBank[currentQuestion].multipleChoice[questionBank[currentQuestion].answer];   // assigns users answer to new variable
    var rightAnswerIndex = questionBank[currentQuestion].answer;                                                // assigns actual answer to new variable
    
    $('#image').html('<img src = "assets/images/'+ imageArray[currentQuestion] +'.png" width = "400px">');      // prints image attached to correct answer
    
	//checks to see correct, incorrect, or unanswered
	if((userSelect == rightAnswerIndex) && (answered == true)) {						// compares fixed answer value of the question bank to the array index value of A thru D 
        correctAnswer++;
        correctSound.play();
		$('#message').html(messages.correct);
	} else if((userSelect != rightAnswerIndex) && (answered == true)) {			
        incorrectAnswer++;
        incorrectSound.play();
		$('#message').html(messages.incorrect);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
	} else {																			// defaults to unanswered in answered =! true
        unanswered++;													
        incorrectSound.play();
		$('#message').html(messages.timeUp);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
		answered = true;
	}
	
	if(currentQuestion == (questionBank.length-1)) {									// determines if on last question or not
		setTimeout(finalResults, 4000)
	} else {
		currentQuestion++;
		setTimeout(newQuestion, 4000);
	}	
}

function finalResults() {
	$('#timeLeft').empty();                                                                     // clear question/anwser fields
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#image').empty();

	$('#resultsMessage').html(messages.finished);                                               // print final totals
	$('#correctAnswers').html("Correct Answers: " + correctAnswer);
	$('#incorrectAnswers').html("Incorrect Answers: " + incorrectAnswer);
	$('#unanswered').html("Unanswered: " + unanswered);
	$('#startOverBtn').addClass('reset');
	$('#startOverBtn').show();                                                                  
	$('#startOverBtn').html('Play Again?');                                                     // show play again button
}