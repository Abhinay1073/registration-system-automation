/**
 * Frugal Testing SE Homework: Dynamic Quiz Application Logic
 * Features: Category/Difficulty Filtering, Per-Question Timer, 
 * Dynamic Loading, and Result Analysis.
 */

// 1. DATA: Question Bank stored in a JS Array [cite: 43]
const questionBank = [
    { 
        id: 1, 
        cat: "Programming", 
        diff: "easy", 
        q: "Which language is used for web styling?", 
        options: ["HTML", "Python", "CSS", "Java"], 
        correct: 2 
    },
    { 
        id: 2, 
        cat: "Programming", 
        diff: "medium", 
        q: "Which of the following is NOT a JavaScript framework?", 
        options: ["React", "Django", "Vue", "Angular"], 
        correct: 1 
    },
    { 
        id: 3, 
        cat: "Programming", 
        diff: "hard", 
        q: "What is the time complexity of a Binary Search algorithm?", 
        options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], 
        correct: 2 
    },
    { 
        id: 4, 
        cat: "General", 
        diff: "easy", 
        q: "What is the capital of France?", 
        options: ["Berlin", "Madrid", "Paris", "Rome"], 
        correct: 2 
    }
];

// 2. STATE VARIABLES [cite: 42]
let filteredQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15; // Seconds per question [cite: 31]
let selectedOption = null;
let quizResults = []; // Stores time spent and correctness for each question [cite: 32]
let questionStartTime;

// 3. CORE FUNCTIONS

/**
 * Initializes the quiz based on user selection [cite: 30]
 */
function startQuiz() {
    const selectedCat = document.getElementById('category-select').value;
    const selectedDiff = document.getElementById('difficulty-select').value;

    // Filter questions dynamically [cite: 30]
    filteredQuestions = questionBank.filter(q => q.cat === selectedCat && q.diff === selectedDiff);

    if (filteredQuestions.length === 0) {
        alert("No questions found for this selection. Try 'Programming' + 'Easy'.");
        return;
    }

    // Toggle Screens
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    loadQuestion();
}

/**
 * Loads a single question and starts the timer [cite: 35, 36]
 */
function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 15; // Reset timer for every new question 
    selectedOption = null;
    questionStartTime = Date.now();

    const currentQ = filteredQuestions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('progress-text').innerText = `Question ${currentQuestionIndex + 1}/${filteredQuestions.length}`;
    document.getElementById('timer-display').innerText = `Time: ${timeLeft}s`;
    document.getElementById('question-text').innerText = currentQ.q;
    document.getElementById('submit-btn').classList.add('hidden'); // Hide submit until option selected

    // Load Options dynamically [cite: 35]
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

/**
 * Handles countdown and auto-submission 
 */
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleSubmission(); // Auto-submit when hits zero 
        }
    }, 1000);
}

/**
 * Highlights selected option and enables submit [cite: 55]
 */
function selectOption(index, element) {
    selectedOption = index;
    // UI selection effect
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('submit-btn').classList.remove('hidden');
}

/**
 * Processes the answer and moves to next question [cite: 32, 41]
 */
function handleSubmission() {
    clearInterval(timerInterval);
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = (selectedOption === filteredQuestions[currentQuestionIndex].correct);

    if (isCorrect) score++;

    // Store data for Result Analysis [cite: 32]
    quizResults.push({
        timeSpent: timeSpent.toFixed(2),
        correct: isCorrect
    });

    currentQuestionIndex++;

    if (currentQuestionIndex < filteredQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

/**
 * Displays results and performance charts 
 */
function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    // Basic Stats [cite: 32, 62]
    const totalQuestions = filteredQuestions.length;
    const correctCount = quizResults.filter(r => r.correct).length;
    const incorrectCount = totalQuestions - correctCount;

    document.getElementById('final-score').innerText = `Score: ${score}/${totalQuestions}`;
    document.getElementById('correct-count').innerText = correctCount;
    document.getElementById('incorrect-count').innerText = incorrectCount;

    renderPerformanceChart(quizResults);
}

/**
 * Renders Chart using Chart.js to analyze time per question [cite: 38]
 */
function renderPerformanceChart(data) {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    // Labels for the questions
    const labels = data.map((_, i) => `Q${i + 1}`);
    const timeSpentData = data.map(r => r.timeSpent);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time Spent (Seconds)',
                data: timeSpentData,
                backgroundColor: '#4f46e5'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}