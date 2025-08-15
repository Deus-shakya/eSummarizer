const modeButtons = document.querySelectorAll(".mode-btn");
const reductionRate = document.getElementById("reductionRate");
const sentenceCount = document.getElementById("sentenceCount");
const wordsCount = document.getElementById("wordsCount");

let currentMode = "paragraph"; //for default
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

const modeConfig = {
  paragraph: {
    url: "/summarize",
    headers: { "Content-Type": "application/json" },
    parseResponse: (data) => data.summarizedText,
  },
  bullets: {
    url: "/summarize",
    headers: { "Content-Type": "application/json" },
    parseResponse: (data) => {
      const sentences = data.summarizedText.match(/[^.!?]+[.!?]?/g) || [];
      return `<ul>${sentences
        .map((s) => `<li>${s.trim()}</li>`)
        .join("")}</ul>`;
    },
  },
  abstractive: {
    url: "/api/summarization/summarize-abs",
    headers: { "Content-Type": "application/json" },
    body: (text) => JSON.stringify({ text, max_length: 100, min_length: 40 }),
    parseResponse: (data) => data.summarizedText,
  },
  classify: {
    url: "/api/classification/classify",
    headers: { "Content-Type": "application/json" },
    body: (text) => JSON.stringify({ text }),
    parseResponse: (data) => data.predictedClass,
  },
};

async function summarize() {
  const text = inputText.value.trim();
  if (!text) return;

  outputText.innerHTML = '<div class="loading">Loading summary...</div>';

  try {
    const config = modeConfig[currentMode] || modeConfig.paragraph;

    const body = config.body ? config.body(text) : text;
    const headers = config.headers;

    const response = await fetch(config.url, {
      method: "POST",
      headers,
      body,
    });

    if (response.status === 401) {
      alert("Login to summarize more than 200 words.");
      window.location.href = "/NewUI/login";
      return;
    }

    const data = await response.json();
    const result = config.parseResponse(data) || "No summary available.";
    if (currentMode == "paragraph" || currentMode == "bullets") {
      reductionRate.innerHTML = `Reduction Rate: ${(
        data.reductionRate * 100
      ).toFixed(2)}%`;
      wordsCount.innerHTML = `Summarized word count: ${data.summarizedWordCount}`;
      sentenceCount.innerHTML = `Summarized sentence count: ${data.summarizedSentenceCount}`;
    } else {
      reductionRate.innerHTML = "";
      wordsCount.innerHTML = "";
      sentenceCount.innerHTML = "";
    }
    clearAllTimeouts();
    outputText.innerHTML = "";
    typeWriter(result, outputText, 0, 1);
  } catch (error) {
    outputText.innerHTML = '<div class="loading">Error loading summary.</div>';
    console.error("Error:", error);
  }
}
