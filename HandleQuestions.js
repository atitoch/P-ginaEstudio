let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];
let correctAnswers = 0;
let questionOrder = [];
let originalQuestions = [];
let quizData = null;
let currentSubject = null;
let currentUnit = null;

const QUIZ_CONFIG = {
  ConmutacionRedes: {
    name: "Conmutación y Redes",
    units: {
      U1: { file: "U1.json", name: "Direccionamiento IP y Enrutamiento" },
      U2: { file: "U2.json", name: "Segmentación de Redes" },
      U3: { file: "U3.json", name: "Protocolos de Red" },
      U4: { file: "U4.json", name: "Administración de Redes" },
    },
  },
  ProgramacionWeb: {
    name: "Programación Web",
    units: {
      "U1-total": {
        file: "U1-total.json",
        name: "Fundamentos de Aplicaciones Web",
      },
      U1: { file: "U1.json", name: "Fundamentos de Aplicaciones Web" },
      U2: { file: "U2.json", name: "Modelo Relacional" },
      U3: { file: "U3.json", name: "SQL Avanzado" },
    },
  },
  SistemasProgramables: {
    name: "Sistemas Programables",
    units: {
      "U1-total": {
        file: "U1-total.json",
        name: "Introducción a Sistemas Programables",
      },
      "U2-total": {
        file: "U2-total.json",
        name: "Introducción a Sistemas Programables",
      },
      "U3-total": {
        file: "U3-total.json",
        name: "Introducción a Sistemas Programables",
      },
      U1: { file: "U1.json", name: "Introducción a SO" },
      U2: { file: "U2.json", name: "Gestión de Procesos" },
      U3: { file: "U3.json", name: "Arduino y Microcontroladores" },
    },
  },
  // Agregar más materias según sea necesario
};

// Función para obtener la configuración de la página actual
function getCurrentPageConfig() {
  const body = document.body;
  const subject = body.getAttribute("data-subject");
  const unit = body.getAttribute("data-unit");

  if (!subject || !unit) {
    throw new Error(
      "No se encontraron los atributos data-subject y data-unit en el body"
    );
  }

  if (!QUIZ_CONFIG[subject]) {
    throw new Error(`Materia '${subject}' no encontrada en la configuración`);
  }

  if (!QUIZ_CONFIG[subject].units[unit]) {
    throw new Error(
      `Unidad '${unit}' no encontrada para la materia '${subject}'`
    );
  }

  return {
    subject,
    unit,
    subjectName: QUIZ_CONFIG[subject].name,
    unitName: QUIZ_CONFIG[subject].units[unit].name,
    fileName: QUIZ_CONFIG[subject].units[unit].file,
  };
}

// Función para construir la ruta del archivo JSON
function buildJsonPath(subject, fileName) {
  return `./${fileName}`;
}

// Función para cargar datos del JSON con ruta dinámica
async function loadQuizData() {
  try {
    const config = getCurrentPageConfig();
    const jsonPath = buildJsonPath(config.subject, config.fileName);

    console.log(`Cargando archivo: ${jsonPath}`);

    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - No se pudo cargar ${jsonPath}`
      );
    }

    const data = await response.json();

    // Validar estructura del JSON
    if (!data.quiz || !data.quiz.questions) {
      throw new Error("Estructura de JSON inválida: falta quiz.questions");
    }

    currentSubject = config.subject;
    currentUnit = config.unit;

    console.log(
      `Datos cargados exitosamente: ${data.quiz.questions.length} preguntas`
    );
    return data;
  } catch (error) {
    console.error("Error loading quiz data:", error);
    throw error;
  }
}

// Función para inicializar preguntas desde JSON
function initializeQuestionsFromJSON() {
  const questionsContainer = document.getElementById("questionsContainer");
  questionsContainer.innerHTML = "";

  quizData.quiz.questions.forEach((questionData, index) => {
    const questionElement = createQuestionHTML(questionData, index);
    questionsContainer.appendChild(questionElement);
  });

  // Actualizar las referencias a las preguntas
  questions = document.querySelectorAll(".question");

  // Actualizar contador total
  document.getElementById("totalQuestions").textContent = questions.length;
}

// Función para mezclar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Función para crear HTML de una pregunta
function createQuestionHTML(questionData, index) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";
  questionDiv.dataset.type = questionData.type || "multiple";

  let optionsHTML = "";

  if (questionData.type === "true_false") {
    // Crear opciones específicas para verdadero/falso
    const trueOption = {
      text: "Verdadero",
      correct: questionData.correct === true,
    };
    const falseOption = {
      text: "Falso",
      correct: questionData.correct === false,
    };

    [trueOption, falseOption].forEach((option, optionIndex) => {
      const optionId = `q${index}_${optionIndex}`;
      const value = option.correct ? "correct" : "incorrect";

      optionsHTML += `
        <li class="option">
          <input type="radio" name="q${index}" value="${value}" id="${optionId}" />
          <label for="${optionId}">${option.text}</label>
        </li>
      `;
    });
  } else {
    // Crear opciones para preguntas de opción múltiple
    questionData.options.forEach((option, optionIndex) => {
      const optionId = `q${index}_${optionIndex}`;
      const value = option.correct ? "correct" : "incorrect";

      optionsHTML += `
        <li class="option">
          <input type="radio" name="q${index}" value="${value}" id="${optionId}" />
          <label for="${optionId}">${option.text}</label>
        </li>
      `;
    });
  }

  questionDiv.innerHTML = `
    <h3>${questionData.question}</h3>
    <ul class="options">
      ${optionsHTML}
    </ul>
    <div class="feedback"></div>
  `;

  return questionDiv;
}

// Función para mezclar las opciones de una pregunta
function shuffleOptions(question) {
  // No mezclar opciones de verdadero/falso
  if (question.dataset.type === "true_false") {
    return;
  }

  const options = question.querySelectorAll(".option");
  if (options.length > 0) {
    const optionsArray = Array.from(options);
    const shuffledOptions = shuffleArray(optionsArray);
    const optionsList = question.querySelector(".options");
    optionsList.innerHTML = "";
    shuffledOptions.forEach((option) => {
      optionsList.appendChild(option);
    });
  }
}

// Función para inicializar el orden aleatorio de las preguntas
function initializeQuestionOrder() {
  questionOrder = Array.from({ length: questions.length }, (_, i) => i);
  questionOrder = shuffleArray(questionOrder);
  originalQuestions = Array.from(questions);

  originalQuestions.forEach((question) => {
    shuffleOptions(question);
  });
}

// Función para obtener la pregunta actual basada en el orden aleatorio
function getCurrentQuestion() {
  const actualIndex = questionOrder[currentQuestionIndex];
  return originalQuestions[actualIndex];
}

// Inicializar el cuestionario
async function initializeApp() {
  try {
    // Mostrar mensaje de carga
    document.getElementById("loadingMessage").style.display = "block";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("quizContainer").style.display = "none";

    // Obtener configuración de la página
    const config = getCurrentPageConfig();
    console.log(
      `Inicializando quiz para: ${config.subjectName} - ${config.unitName}`
    );

    // Cargar datos del JSON
    quizData = await loadQuizData();

    // Crear preguntas desde JSON
    initializeQuestionsFromJSON();

    // Inicializar quiz
    initializeQuiz();

    // Mostrar contenedor del quiz
    document.getElementById("loadingMessage").style.display = "none";
    document.getElementById("quizContainer").style.display = "block";
  } catch (error) {
    console.error("Error initializing app:", error);

    // Mostrar error detallado
    document.getElementById("loadingMessage").style.display = "none";
    document.getElementById("errorMessage").style.display = "block";

    const errorDetails = document.getElementById("errorDetails");
    if (errorDetails) {
      errorDetails.innerHTML = `
        <strong>Error:</strong> ${error.message}<br>
        <em>Verifica que el archivo JSON existe y tiene el formato correcto.</em>
      `;
    }
  }
}

function initializeQuiz() {
  userAnswers = new Array(questions.length).fill(null);
  currentQuestionIndex = 0;
  correctAnswers = 0;

  initializeQuestionOrder();

  document.querySelector(".results").style.display = "none";
  showQuestion(0);
  updateProgress();
}

function showQuestion(index) {
  originalQuestions.forEach((q) => {
    q.classList.remove("active");
  });

  const currentQuestion = getCurrentQuestion();
  if (currentQuestion) {
    currentQuestion.classList.add("active");
  }

  document.getElementById("currentQuestion").textContent = index + 1;
  updateButtons();
  updateProgress();
}

function updateButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const checkBtn = document.getElementById("checkBtn");

  prevBtn.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = "Ver Resultados";
    nextBtn.disabled = false;
  } else {
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
  }

  if (userAnswers[currentQuestionIndex] !== null) {
    checkBtn.style.display = "none";
    nextBtn.disabled = false;
  } else {
    checkBtn.style.display = "inline-block";
  }
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

function checkAnswer() {
  const currentQuestion = getCurrentQuestion();
  const selectedOption = currentQuestion.querySelector(
    'input[type="radio"]:checked'
  );

  if (!selectedOption) {
    alert("Por favor selecciona una respuesta");
    return;
  }

  const userAnswer = selectedOption.value;
  const isCorrect = selectedOption.value === "correct";

  // Mostrar feedback visual
  const options = currentQuestion.querySelectorAll(".option");
  options.forEach((option) => {
    const input = option.querySelector('input[type="radio"]');
    if (input.value === "correct") {
      option.classList.add("correct");
    } else if (input.checked && input.value === "incorrect") {
      option.classList.add("incorrect");
    }
  });

  // Guardar respuesta
  userAnswers[currentQuestionIndex] = {
    answer: userAnswer,
    correct: isCorrect,
  };

  if (isCorrect) {
    correctAnswers++;
  }

  showFeedback(isCorrect);
  updateButtons();
}

function showFeedback(isCorrect) {
  const currentQuestion = getCurrentQuestion();
  const feedback = currentQuestion.querySelector(".feedback");
  const actualIndex = questionOrder[currentQuestionIndex];
  const questionData = quizData.quiz.questions[actualIndex];

  feedback.style.display = "block";
  feedback.className = "feedback " + (isCorrect ? "correct" : "incorrect");

  if (isCorrect) {
    feedback.innerHTML = `
      <strong>¡Correcto! 🎉</strong><br>
      Excelente trabajo. Has seleccionado la respuesta correcta.
      ${
        questionData.feedback ? `<br><br><em>${questionData.feedback}</em>` : ""
      }
    `;
  } else {
    // Encontrar la respuesta correcta
    const correctOption = currentQuestion.querySelector(
      'input[value="correct"]'
    );
    const correctLabel = correctOption
      ? correctOption.nextElementSibling.textContent
      : "No encontrada";

    feedback.innerHTML = `
      <strong>Incorrecto ❌</strong><br>
      La respuesta correcta es: <strong>"${correctLabel}"</strong><br>
      <em>Te recomendamos revisar el material de estudio para reforzar este concepto.</em>
      ${
        questionData.feedback
          ? `<br><br><strong>Explicación:</strong> ${questionData.feedback}`
          : ""
      }
    `;
  }
}

function showResults() {
  const currentQuestion = getCurrentQuestion();
  currentQuestion.classList.remove("active");

  const resultsDiv = document.querySelector(".results");
  resultsDiv.style.display = "block";

  const percentage = Math.round((correctAnswers / questions.length) * 100);

  document.getElementById("score").textContent = percentage + "%";
  document.getElementById("correctAnswers").textContent = correctAnswers;
  document.getElementById("totalQuestionsResult").textContent =
    questions.length;

  document.querySelector(".controls").style.display = "none";
  document.querySelector(".question-counter").style.display = "none";
  document.querySelector(".quiz-progress").style.display = "none";
}

function restartQuiz() {
  correctAnswers = 0;
  userAnswers = new Array(questions.length).fill(null);
  currentQuestionIndex = 0;

  originalQuestions.forEach((question) => {
    question.classList.remove("active");

    const options = question.querySelectorAll(".option");
    options.forEach((option) => {
      option.classList.remove("correct", "incorrect");
    });

    const radios = question.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      radio.checked = false;
    });

    const feedback = question.querySelector(".feedback");
    feedback.style.display = "none";
  });

  document.querySelector(".controls").style.display = "flex";
  document.querySelector(".question-counter").style.display = "block";
  document.querySelector(".quiz-progress").style.display = "block";

  initializeQuiz();
}

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && currentQuestionIndex > 0) {
    previousQuestion();
  } else if (
    e.key === "ArrowRight" &&
    currentQuestionIndex < questions.length - 1
  ) {
    nextQuestion();
  } else if (e.key === "Enter") {
    const checkBtn = document.getElementById("checkBtn");
    if (checkBtn.style.display !== "none") {
      checkAnswer();
    } else {
      nextQuestion();
    }
  }
});

// Inicializar la aplicación cuando se carga la página
document.addEventListener("DOMContentLoaded", initializeApp);
