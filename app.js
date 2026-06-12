const AUTO_NEXT_DELAY = 800;

const elements = {
  totalCount: document.querySelector("#totalCount"),
  correctCount: document.querySelector("#correctCount"),
  wrongCount: document.querySelector("#wrongCount"),
  wordIndex: document.querySelector("#wordIndex"),
  questionText: document.querySelector("#questionText"),
  choiceArea: document.querySelector("#choiceArea"),
  feedback: document.querySelector("#feedback"),
  nextQuestion: document.querySelector("#nextQuestion"),
  resetPractice: document.querySelector("#resetPractice"),
  questionCard: document.querySelector(".question-card"),
  wrongBookCount: document.querySelector("#wrongBookCount"),
  wrongBookList: document.querySelector("#wrongBookList"),
  modeButtons: document.querySelectorAll("[data-mode]"),
  difficultyButtons: document.querySelectorAll("[data-difficulty]")
};

let state = {
  currentWord: null,
  answered: false,
  total: 0,
  correct: 0,
  wrong: 0,
  wrongBook: [],
  autoNextTimer: null,
  mode: "en-to-zh",
  difficulty: "all"
};

function getActiveWords() {
  if (state.difficulty === "all") {
    return WORDS;
  }
  return WORDS.filter((item) => item.difficulty === state.difficulty);
}

function pickRandomWord() {
  const activeWords = getActiveWords();
  const index = Math.floor(Math.random() * activeWords.length);
  return activeWords[index];
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getChoiceOptions(targetWord) {
  const sourceWords = getActiveWords().length >= 4 ? getActiveWords() : WORDS;
  const distractors = sourceWords
    .filter((item) => item.word !== targetWord.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return shuffle([targetWord, ...distractors]);
}

function getQuestionText(word) {
  return state.mode === "zh-to-en" ? word.meaning : word.word;
}

function getOptionText(word) {
  return state.mode === "zh-to-en" ? word.word : word.meaning;
}

function getCorrectAnswerText(word) {
  return state.mode === "zh-to-en" ? word.word : word.meaning;
}

function updateStats() {
  elements.totalCount.textContent = state.total;
  elements.correctCount.textContent = state.correct;
  elements.wrongCount.textContent = state.wrong;
}

function updateControls() {
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  elements.difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.difficulty === state.difficulty);
  });
  elements.questionCard.classList.toggle("meaning-mode", state.mode === "zh-to-en");
}

function setFeedback(message, type) {
  elements.feedback.textContent = message;
  elements.feedback.className = `feedback ${type || ""}`.trim();
}

function addWrongWord(word) {
  const exists = state.wrongBook.some((item) => item.word === word.word);
  if (!exists) {
    state.wrongBook.push(word);
  }
  renderWrongBook();
}

function renderWrongBook() {
  elements.wrongBookCount.textContent = `${state.wrongBook.length} 个`;

  if (state.wrongBook.length === 0) {
    elements.wrongBookList.innerHTML = '<li class="empty-state">答错的词会自动记录在这里。</li>';
    return;
  }

  elements.wrongBookList.innerHTML = state.wrongBook
    .map((item) => `<li><strong>${item.word}</strong>${item.meaning}</li>`)
    .join("");
}

function clearAutoNextTimer() {
  if (state.autoNextTimer) {
    window.clearTimeout(state.autoNextTimer);
    state.autoNextTimer = null;
  }
}

function lockChoiceButtons() {
  state.answered = true;
  elements.choiceArea.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
}

function scheduleAutoNext() {
  clearAutoNextTimer();
  state.autoNextTimer = window.setTimeout(() => {
    renderQuestion();
  }, AUTO_NEXT_DELAY);
}

function judgeAnswer(option, selectedButton) {
  if (state.answered) return;

  const isCorrect = option.word === state.currentWord.word;
  state.total += 1;

  if (isCorrect) {
    state.correct += 1;
    setFeedback("回答正确，即将进入下一题。", "correct");
  } else {
    state.wrong += 1;
    addWrongWord(state.currentWord);
    setFeedback(`回答错误，正确答案：${getCorrectAnswerText(state.currentWord)}`, "wrong");
  }

  selectedButton.classList.add(isCorrect ? "correct" : "wrong");
  elements.choiceArea.querySelectorAll("button").forEach((button) => {
    if (button.dataset.word === state.currentWord.word) {
      button.classList.add("correct");
    }
  });

  lockChoiceButtons();
  updateStats();

  if (isCorrect) {
    scheduleAutoNext();
  }
}

function renderQuestion() {
  clearAutoNextTimer();
  const activeWords = getActiveWords();

  if (activeWords.length === 0) {
    elements.questionText.textContent = "当前难度暂无词条";
    elements.choiceArea.innerHTML = "";
    setFeedback("请切换到其他难度。", "wrong");
    return;
  }

  state.currentWord = pickRandomWord();
  state.answered = false;

  elements.questionText.textContent = getQuestionText(state.currentWord);
  elements.wordIndex.textContent = `第 ${state.total + 1} 题`;
  elements.choiceArea.innerHTML = "";
  setFeedback("", "");
  updateControls();
  updateStats();

  getChoiceOptions(state.currentWord).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.dataset.word = option.word;
    button.textContent = getOptionText(option);
    button.addEventListener("click", () => {
      judgeAnswer(option, button);
    });
    elements.choiceArea.appendChild(button);
  });
}

function resetPractice() {
  clearAutoNextTimer();
  state = {
    ...state,
    currentWord: null,
    answered: false,
    total: 0,
    correct: 0,
    wrong: 0,
    wrongBook: [],
    autoNextTimer: null
  };
  renderWrongBook();
  renderQuestion();
}

function setMode(mode) {
  state.mode = mode;
  renderQuestion();
}

function setDifficulty(difficulty) {
  state.difficulty = difficulty;
  renderQuestion();
}

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

elements.difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
});

elements.nextQuestion.addEventListener("click", renderQuestion);
elements.resetPractice.addEventListener("click", resetPractice);

updateControls();
renderWrongBook();
renderQuestion();
