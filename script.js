document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const backgroundMusic = document.getElementById('background-music');
    const container = document.querySelector('.container');
    const game = document.getElementById('game');
    const loadingScreen = document.getElementById('loading-screen');

    startButton.addEventListener('click', () => {
        // Show loading screen
        loadingScreen.style.display = 'flex';

        // Simulate loading time
        setTimeout(() => {
            // Play background music
            backgroundMusic.play().then(() => {
                console.log("Background music is playing.");
            }).catch(error => {
                console.log("Auto-play blocked. Background music cannot start automatically.");
            });

            // Fade out the start button and container
            container.classList.add('fade-out');
            setTimeout(() => {
                startButton.style.display = 'none'; // Hide start button
                game.style.display = 'block'; // Show game
                game.classList.add('fade-in'); // Fade in the game
                showQuestion(); // Start the game

                // Hide loading screen
                loadingScreen.style.display = 'none';
            }, 500); // Wait for fade-out animation to finish
        }, 2000); // Simulate 2 seconds loading time
    });

    document.getElementById('next-btn').addEventListener('click', nextQuestion);

    // Ensure background music starts automatically
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            backgroundMusic.play().catch(error => {
                console.log("Background music playback error: ", error);
            });
        }
    });
});

const questions = [
    {
        question: "Ano Favorite Kong Kulay?",
        answers: [
            { text: 'Red', correct: false },
            { text: 'Blue', correct: true },
            { text: 'Green', correct: false },
            { text: 'Yellow', correct: false }
        ]
    },
    {
        question: "Ano yung kadalasan kong ginagawa/hobby?",
        answers: [
            { text: 'Chess', correct: false },
            { text: 'Tulog', correct: true },
            { text: 'Drawing', correct: false },
            { text: 'Gaming', correct: false }
        ]
    },
    {
        question: "What is my favorite food?",
        answers: [
            { text: 'Adobo', correct: false },
            { text: 'Tinola', correct: false },
            { text: 'Pakbet', correct: false },
            { text: 'Sinigang', correct: true }
        ]
    },
    {
        question: "What's your partner's favorite movie genre?",
        answers: [
            { text: 'Action', correct: false },
            { text: 'Romance', correct: true },
            { text: 'Comedy', correct: false },
            { text: 'Horror', correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;

function showQuestion() {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const imageContainer = document.getElementById('image-container');

    questionContainer.classList.add('active');
    document.getElementById('result-container').style.display = 'none'; // Hide result container initially
    imageContainer.style.display = 'none'; // Hide image container initially

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    answerButtonsElement.innerHTML = '';
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');

    Array.from(document.getElementById('answer-buttons').children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }
    });

    selectedButton.classList.add('selected');
    if (correct) {
        selectedButton.classList.add('correct');
        score++;
        correctSound.play().catch(error => {
            console.log("Correct answer sound playback error: ", error);
        });
        document.getElementById('image-container').innerHTML = `<img src="funnygifsbox-2019-06-10-13-08-30-48.gif" alt="Correct">`;
    } else {
        selectedButton.classList.add('wrong');
        wrongSound.play().catch(error => {
            console.log("Wrong answer sound playback error: ", error);
        });
        document.getElementById('image-container').innerHTML = `<img src="bubu-bubu-dudu.gif" alt="Wrong">`;
    }

    document.getElementById('image-container').style.display = 'block'; // Show image container
    document.getElementById('next-btn').style.display = 'inline-block'; // Show the button
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
    document.getElementById('next-btn').style.display = 'none'; // Hide the button after moving to next question
}

function showResult() {
    const resultContainer = document.getElementById('result-container');
    const resultElement = document.getElementById('result');

    resultContainer.style.display = 'flex'; // Show result container
    document.getElementById('question-container').classList.remove('active');

    // Choose the score image based on the score
    let scoreImage;
    if (score === questions.length) {
        scoreImage = 'ubfperfect.gif'; // Perfect score image
    } else if (score >= questions.length * 0.75) {
        scoreImage = 'high-quality-good-taste.gif'; // Great score image
    } else if (score >= questions.length * 0.5) {
        scoreImage = 'good-job-cute-baby.gif'; // Average score image
    } else {
        scoreImage = 'error-404.gif'; // Try again score image
    }

    document.querySelector('.score-image').src = scoreImage;
    resultElement.innerText = `Your score: ${score} out of ${questions.length}`;
}

function restartGame() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('question-container').classList.add('active');
    showQuestion();
}
