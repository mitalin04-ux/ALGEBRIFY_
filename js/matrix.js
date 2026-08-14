// ==============================
// Matrix Calculator
// ==============================

const addButton = document.getElementById("add-btn");

addButton.addEventListener("click", function () {

    // Matrix A

    const a11 = Number(document.getElementById("a11").value);
    const a12 = Number(document.getElementById("a12").value);
    const a21 = Number(document.getElementById("a21").value);
    const a22 = Number(document.getElementById("a22").value);

    // Matrix B

    const b11 = Number(document.getElementById("b11").value);
    const b12 = Number(document.getElementById("b12").value);
    const b21 = Number(document.getElementById("b21").value);
    const b22 = Number(document.getElementById("b22").value);

    // Result

    const c11 = a11 + b11;
    const c12 = a12 + b12;
    const c21 = a21 + b21;
    const c22 = a22 + b22;

    document.getElementById("result").innerHTML = `
        <div class="result-matrix">
            <span>${c11}</span>
            <span>${c12}</span>
            <span>${c21}</span>
            <span>${c22}</span>
        </div>
    `;

});

const subtractButton = document.getElementById("subtract-btn");

subtractButton.addEventListener("click", function () {



    // Matrix A

    const a11 = Number(document.getElementById("a11").value);
    const a12 = Number(document.getElementById("a12").value);
    const a21 = Number(document.getElementById("a21").value);
    const a22 = Number(document.getElementById("a22").value);

    // Matrix B

    const b11 = Number(document.getElementById("b11").value);
    const b12 = Number(document.getElementById("b12").value);
    const b21 = Number(document.getElementById("b21").value);
    const b22 = Number(document.getElementById("b22").value);

    // Result

    const c11 = a11 - b11;
    const c12 = a12 - b12;
    const c21 = a21 - b21;
    const c22 = a22 - b22;

    document.getElementById("result").innerHTML = `
        <div class="result-matrix">
            <span>${c11}</span>
            <span>${c12}</span>
            <span>${c21}</span>
            <span>${c22}</span>
        </div>
    `;


});

const multiplyButton = document.getElementById("multiply-btn");

multiplyButton.addEventListener("click", function () {

    // Matrix A

    const a11 = Number(document.getElementById("a11").value);
    const a12 = Number(document.getElementById("a12").value);
    const a21 = Number(document.getElementById("a21").value);
    const a22 = Number(document.getElementById("a22").value);

    // Matrix B

    const b11 = Number(document.getElementById("b11").value);
    const b12 = Number(document.getElementById("b12").value);
    const b21 = Number(document.getElementById("b21").value);
    const b22 = Number(document.getElementById("b22").value);

    // Result

    const c11 = (a11 * b11) + (a12 * b21);
    const c12 = (a11 * b12) + (a12 * b22);

    const c21 = (a21 * b11) + (a22 * b21);
    const c22 = (a21 * b12) + (a22 * b22);

    document.getElementById("result").innerHTML = `
        <div class="result-matrix">
            <span>${c11}</span>
            <span>${c12}</span>
            <span>${c21}</span>
            <span>${c22}</span>
        </div>
    `;

});


const clearButton = document.getElementById("clear-btn");

clearButton.addEventListener("click", function () {
document.getElementById("a11").value = "";
document.getElementById("a12").value = "";
document.getElementById("a21").value = "";
document.getElementById("a22").value = "";

document.getElementById("b11").value = "";
document.getElementById("b12").value = "";
document.getElementById("b21").value = "";
document.getElementById("b22").value = "";

document.getElementById("result").innerHTML =

    "Result will appear here.";


});

// ==============================
// Matrix Quiz
// ==============================

const quiz = [

{

question:"What is an Identity Matrix?",

answers:[

"A matrix having all zero elements",

"A square matrix having 1s on the main diagonal",

"A triangular matrix",

"A matrix with equal rows"

],

correct:1

},

{

question:"How many rows does a 3 × 4 matrix have?",

answers:[

"3",

"4",

"7",

"12"

],

correct:0

},

{

question:"Which operation is NOT possible for every pair of matrices?",

answers:[

"Addition",

"Transpose",

"Multiplication",

"Subtraction"

],

correct:2

},

{

question:"A square matrix has...",

answers:[

"Equal rows and columns",

"Only one row",

"Only one column",

"No diagonal"

],

correct:0

},

{

question:"The transpose of a matrix swaps...",

answers:[

"Rows and columns",

"Only rows",

"Only columns",

"Nothing"

],

correct:0

}

];

let currentQuestion = 0;

let score = 0;

const questionNumber = document.getElementById("question-number");

const question = document.getElementById("question");

const answers = document.getElementById("answers");

const nextButton = document.getElementById("next-btn");

const scoreText = document.getElementById("score");

const quizResult = document.getElementById("quiz-result");

function loadQuestion(){

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${quiz.length}`;

    question.textContent =
        quiz[currentQuestion].question;

    answers.innerHTML = "";

    quiz[currentQuestion].answers.forEach(function(answer,index){

        const button = document.createElement("button");

        button.classList.add("answer-btn");

        button.textContent = answer;

        button.onclick = function(){

            checkAnswer(index);

        };

        answers.appendChild(button);

    });

}

function checkAnswer(selected){

    const correct = quiz[currentQuestion].correct;

    const buttons =
        document.querySelectorAll(".answer-btn");

    buttons.forEach(function(button){

        button.disabled = true;

    });

    if(selected === correct){

        quizResult.textContent =
            "✅ Correct!";

        quizResult.style.color =
            "#26A69A";

        score++;

    }

    else{

        quizResult.textContent =
            "❌ Incorrect!";

        quizResult.style.color =
            "#D32F2F";

    }

}

nextButton.addEventListener("click",function(){

    currentQuestion++;

    if(currentQuestion < quiz.length){

        quizResult.textContent = "";

        loadQuestion();

    }

    else{

        showScore();

    }

});

function showScore(){

    questionNumber.textContent =
        "Quiz Completed";

    question.textContent =
        "Great Job!";

    answers.innerHTML = "";

    nextButton.style.display =
        "none";

    quizResult.textContent = "";

    scoreText.textContent =
        `Your Score: ${score} / ${quiz.length}`;

}

loadQuestion();

