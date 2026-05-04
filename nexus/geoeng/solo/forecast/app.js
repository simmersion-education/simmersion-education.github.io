let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audio;
let timerInterval;
let seconds = 0;

const scenarioTitle = document.getElementById("scenario-title");
const scenarioDescription = document.getElementById("scenario-description");
const modelOutput = document.getElementById("model-output");

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const playBtn = document.getElementById("play-btn");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const timerDisplay = document.getElementById("timer");

let scenarios = [];
let currentIndex = 0;

// Load scenarios
fetch("scenarios.json")
  .then(res => res.json())
  .then(data => {
    scenarios = data;
    loadScenario();
  });

function loadScenario() {
  const s = scenarios[currentIndex];
  scenarioTitle.textContent = s.scenario;
  scenarioDescription.textContent = s.description;

  modelOutput.textContent =
    `Wind:        ${s.model.wind}\n` +
    `Rain:        ${s.model.rain}\n` +
    `Visibility:  ${s.model.visibility}\n` +
    `Temperature: ${s.model.temperature}\n` +
    `Sea State:   ${s.model.sea}`;
}

startBtn.onclick = async () => {
  audioChunks = [];
  seconds = 0;
  timerDisplay.textContent = "0s";

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    audioUrl = URL.createObjectURL(audioBlob);
    audio = new Audio(audioUrl);
  };

  mediaRecorder.start();

  startBtn.style.display = "none";
  stopBtn.style.display = "inline-block";

  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = seconds + "s";
  }, 1000);
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  clearInterval(timerInterval);

  stopBtn.style.display = "none";
  playBtn.style.display = "inline-block";
  submitBtn.style.display = "inline-block";
  retryBtn.style.display = "inline-block";
};

playBtn.onclick = () => {
  if (audio) audio.play();
};

retryBtn.onclick = () => {
  playBtn.style.display = "none";
  submitBtn.style.display = "none";
  retryBtn.style.display = "none";
  startBtn.style.display = "inline-block";
  timerDisplay.textContent = "";
};

submitBtn.onclick = () => {
  alert("Forecast received. Logged to the training archive.");
  currentIndex = (currentIndex + 1) % scenarios.length;
  loadScenario();

  playBtn.style.display = "none";
  submitBtn.style.display = "none";
  retryBtn.style.display = "none";
  startBtn.style.display = "inline-block";
  timerDisplay.textContent = "";
};
