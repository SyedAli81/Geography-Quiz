// Start the quiz with a timer set to 75. Timer left also will be the final score

var timeLeft = 75;
var timerID;
var timerEl = document.getElementById("timer");
var startButton = document.getElementById("start-btn");
var nextButton = document.getElementById("next-btn");

var questionContainerEl = document.getElementById("question-container");
var startContainerEl = document.getElementById("start-container");
var questionEl = document.getElementById("question");
var answerButtonsEl = document.getElementById("answer-buttons");
var checkAnswerEl = document.getElementById("check-answer");

var viewHighScores = document.getElementById("highscores-link");

var submitButton = document.getElementById("submit-btn");
var clearScoreButton = document.getElementById("clear-btn");

var initialsField = document.getElementById("player-name");

var restartButton = document.getElementById("restart-btn");

var scoreField = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores")) || [];

var shuffledQuestions, currentQuestionIndex;

// Start button trigger the first question and next button to display

startButton.addEventListener("mouseover", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  // call for next question
  setNextQuestion();
});

// function which runs every second
function timeTick() {
  timeLeft--;
  timerEl.textContent = "Time: " + timeLeft;
  if (timeLeft <= 0) {
    saveScore();
  }
}

// Start Quiz
function startGame() {
  timerID = setInterval(timeTick, 1000);
  startContainerEl.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  questionContainerEl.classList.remove("hide");

  // Timer will start as soon as start button is clicked
  timeTick();
  setNextQuestion();
}

// Go to next Question
function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Display Questions
function showQuestion(question) {
  questionEl.innerText = question.question;
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}

// Reset State Function
function resetState() {
  nextButton.classList.add("hide");
  checkAnswerEl.classList.add("hide");
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}

// Select the answer from function
function selectAnswer(e) {
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;
  checkAnswerEl.classList.remove("hide");
  // Check if the answer correct ot wrong then show the text;
  if (correct) {
    checkAnswerEl.innerHTML = "You got it right!";
  } else {
    checkAnswerEl.innerHTML = "Sorry that was not the correct answer.";
    if (timeLeft <= 10) {
      timeLeft = 0;
    } else {
      // If the answer is wrong, deduct time by 10
      timeLeft -= 10;
    }
  }

  Array.from(answerButtonsEl.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
    checkAnswerEl.classList.remove("hide");
  } else {
    startButton.classList.remove("hide");
    saveScore();
  }
}

// Check and show the correct answer by set the buttons colors
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

// Remove all the classes later
function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

// Save Scores
function saveScore() {
  clearInterval(timerID);
  timerEl.textContent = "Time: " + timeLeft;
  setTimeout(function () {
    questionContainerEl.classList.add("hide");
    document.getElementById("score-container").classList.remove("hide");
    document.getElementById("your-score").textContent =
      "Your final score is " + timeLeft;
  }, 2000);
}

var loadScores = function () {
  // get score from the local storage
  if (!savedScores) {
    return false;
  }

  // convert scores from string field format into array
  savedScores = JSON.parse(savedScores);
  var initials = document.querySelector("#initials-field").value;

  var newScore = {
    score: timeLeft,
    initials: initials,
  };

  savedScores.push(newScore)
  console.log(savedScores, "savedScores TEST");

  savedScores.forEach((score) => {
    initialsField.innerText = score.initials;
    scoreField.innerText = score.score;
  });
};

// Display high scores

function showHighScores(initials) {
  document.getElementById("highscores").classList.remove("hide");
  document.getElementById("score-container").classList.add("hide");

  startContainerEl.classList.add("hide");

  questionContainerEl.classList.add("hide");

  if (typeof initials == "string") {
    var score = {
      initials,
      timeLeft,
    };
    scores.push(score);
  }

  var highScoreEl = document.getElementById("highscore");
  highScoreEl.innerHTML = "";

  for (i = 0; i < scores.length; i++) {
    var div1 = document.createElement("div");
    div1 = document.createElement("div");
    div1.setAttribute("class", "name-div");

    div1.innerText = scores[i].initials;
    var div2 = document.createElement("div");
    div2.setAttribute("class", "score-div");
    div2.innerText = scores[i].timeLeft;

    highScoreEl.appendChild(div1);
    highScoreEl.appendChild(div2);
  }
  localStorage.setItem("scores", JSON.stringify(scores));
}



// View High Scores link

viewHighScores.addEventListener("click", showHighScores);

submitButton.addEventListener("click", showHighScores);


submitButton.addEventListener("click", function(event){
    event.preventDefault();

    var initials = document.querySelector("#initials-field").value;

    showHighScores(initials);

});

// Restart or reload the page

restartButton.addEventListener("click", function(){
    window.location.reload();

});


// Clear LocalStorage items;

clearScoreButton.addEventListener("click", function(){

    localStorage.clear();
    document.getElementById("highscore").innerHTML = "";


})