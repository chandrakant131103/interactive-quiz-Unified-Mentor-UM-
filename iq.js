// questions are placed in array format of objects, each containing a question, options, the index of the correct answer, and a hint.

// array contains 5 question and each question has 4 options, one of which is correct. and index of correct answer is also provided.
        // Quiz data
        const quizData = [
            {
                question: "What is the correct way to declare a variable in JavaScript?",
                options: [
                    "var myVariable;",
                    "variable myVariable;",
                    "v myVariable;",
                    "declare myVariable;"
                ],
                correct: 0,
                hint: "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords."
            },
            {
                question: "Which method is used to add an element to the end of an array?",
                options: [
                    "push()",
                    "add()",
                    "append()",
                    "insert()"
                ],
                correct: 0,
                hint: "The push() method adds one or more elements to the end of an array."
            },
            {
                question: "What does '===' operator do in JavaScript?",
                options: [
                    "Assigns a value",
                    "Checks equality without type conversion",
                    "Checks equality with type conversion",
                    "Compares memory addresses"
                ],
                correct: 1,
                hint: "The '===' operator is called the strict equality operator and compares both value and type."
            },
            {
                question: "Which of the following is NOT a JavaScript data type?",
                options: [
                    "String",
                    "Boolean",
                    "Float",
                    "Number"
                ],
                correct: 2,
                hint: "JavaScript has Number type for all numeric values, there's no separate Float type."
            },
            {
                question: "What is the correct way to write a JavaScript function?",
                options: [
                    "function = myFunction() {}",
                    "function myFunction() {}",
                    "create myFunction() {}",
                    "def myFunction() {}"
                ],
                correct: 1,
                hint: "Functions in JavaScript are declared using the 'function' keyword followed by the function name."
            }
        ];


        // Global variables
        let currentQuestion = 0;
        let score = 0;
        let selectedAnswers = [];
        let timer;
        let timeLeft = 30;
        let quizStarted = false;

        // Initialize quiz
        function initializeQuiz() {
            currentQuestion = 0;
            score = 0;
            selectedAnswers = [];
            timeLeft = 30;
            quizStarted = true;

            document.getElementById('total-questions').textContent = quizData.length;
            document.getElementById('results').style.display = 'none';
            document.getElementById('question-container').style.display = 'block';
            document.querySelector('.controls').style.display = 'flex';
            document.querySelector('.quiz-info').style.display = 'flex';
            document.querySelector('.progress-bar').style.display = 'block';

            loadQuestion();
            startTimer();
        }

        // Load current question
        function loadQuestion() {
            const question = quizData[currentQuestion];

            document.getElementById('current-question').textContent = currentQuestion + 1;
            document.getElementById('question-text').textContent = question.question;
            
            // Update progress bar
            const progress = ((currentQuestion + 1) / quizData.length) * 100;
            document.getElementById('progress-fill').style.width = progress + '%';
            
            // Load options
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.onclick = () => selectOption(index);
                
                optionElement.innerHTML = `
                    <input type="radio" name="question${currentQuestion}" value="${index}" id="option${index}">
                    <div class="option-text">${option}</div>
                `;
                
                optionsContainer.appendChild(optionElement);
            });
            
            // Update button states
            document.getElementById('prev-btn').disabled = currentQuestion === 0;
            document.getElementById('next-btn').textContent = currentQuestion === quizData.length - 1 ? 'Finish' : 'Next';
            
            // Hide hint
            document.getElementById('hint').classList.remove('show');
            
            // Restore selected answer if exists
            if (selectedAnswers[currentQuestion] !== undefined) {
                selectOption(selectedAnswers[currentQuestion]);
            }
            
            // Reset timer
            timeLeft = 30;
            updateTimer();
        }

        // Select option
        function selectOption(index) {
            const options = document.querySelectorAll('.option');
            options.forEach(option => option.classList.remove('selected'));
            
            options[index].classList.add('selected');
            selectedAnswers[currentQuestion] = index;
            
            document.getElementById('next-btn').disabled = false;
        }

        // Next question
        function nextQuestion() {
            if (selectedAnswers[currentQuestion] === undefined) {
                alert('Please select an answer before proceeding.');
                return;
            }
            
            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                loadQuestion();
            } else {
                finishQuiz();
            }
        }

        // Previous question
        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
            }
        }

        // Show hint
        function showHint() {
            const hint = document.getElementById('hint');
            hint.textContent = quizData[currentQuestion].hint;
            hint.classList.add('show');
        }

        // Timer functions
        function startTimer() {
            timer = setInterval(() => {
                timeLeft--;
                updateTimer();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Auto-select random answer if no selection
                    if (selectedAnswers[currentQuestion] === undefined) {
                        selectOption(Math.floor(Math.random() * quizData[currentQuestion].options.length));
                    }
                    nextQuestion();
                }
            }, 1000);
        }

        function updateTimer() {
            document.getElementById('timer').textContent = timeLeft;
        }

        // Finish quiz
        function finishQuiz() {
            clearInterval(timer);
            
            // Calculate score
            score = 0;
            for (let i = 0; i < quizData.length; i++) {
                if (selectedAnswers[i] === quizData[i].correct) {
                    score++;
                }
            }
            
            // Show results
            showResults();
        }

        // Show results
        function showResults() {
            document.getElementById('question-container').style.display = 'none';
            document.querySelector('.controls').style.display = 'none';
            document.querySelector('.quiz-info').style.display = 'none';
            document.querySelector('.progress-bar').style.display = 'none';
            
            const results = document.getElementById('results');
            results.style.display = 'block';
            
            document.getElementById('score-display').textContent = `${score}/${quizData.length}`;
            
            // Score message
            let message = '';
            const percentage = (score / quizData.length) * 100;
            
            if (percentage >= 80) {
                message = 'Excellent! You have a great understanding of JavaScript!';
            } else if (percentage >= 60) {
                message = 'Good job! You have a solid foundation in JavaScript.';
            } else if (percentage >= 40) {
                message = 'Not bad, but you might want to review some concepts.';
            } else {
                message = 'Keep studying! JavaScript takes practice to master.';
            }
            
            document.getElementById('score-message').textContent = message;
            
            // Detailed results
            let detailsHTML = '<h3>Detailed Results:</h3>';
            for (let i = 0; i < quizData.length; i++) {
                const question = quizData[i];
                const userAnswer = selectedAnswers[i];
                const isCorrect = userAnswer === question.correct;
                
                detailsHTML += `
                    <div style="margin: 15px 0; padding: 15px; background: ${isCorrect ? '#d4edda' : '#f8d7da'}; border-radius: 8px;">
                        <strong>Question ${i + 1}:</strong> ${question.question}<br>
                        <strong>Your Answer:</strong> ${question.options[userAnswer]}<br>
                        <strong>Correct Answer:</strong> ${question.options[question.correct]}<br>
                        <strong>Result:</strong> ${isCorrect ? ' Correct' : ' Incorrect'}
                    </div>
                `;
            }
            
            document.getElementById('score-details').innerHTML = detailsHTML;
        }

        // Restart quiz
        function restartQuiz() {
            initializeQuiz();
        }

        // Initialize quiz when page loads
        window.onload = function() {
            initializeQuiz();
        };
