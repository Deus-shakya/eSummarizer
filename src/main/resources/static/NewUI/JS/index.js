// Get DOM elements
const inputText = document.getElementById("inputText");
const wordCount = document.getElementById("wordCount");
const summarizeBtn = document.getElementById("summarizeBtn");
const outputSection = document.getElementById("outputSection");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const modeButtons = document.querySelectorAll(".mode-btn");
const lengthSlider = document.getElementById("lengthSlider");
const fileInput = document.getElementById("fileInput");

let currentMode = "paragraph";
let summaryLength = 2;

// Update word count
function updateWordCount() {
  const text = inputText.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const sentences = text
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0;
  wordCount.textContent = `${sentences} sentences • ${words} words`;
}

// Mode selection
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

// Length slider
lengthSlider.addEventListener("input", (e) => {
  summaryLength = parseInt(e.target.value);
});

// File upload
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      inputText.value = e.target.result;
      updateWordCount();
    };
    reader.readAsText(file);
  }
});

// Simple text summarization function
function summarizeText(text, mode, length) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (sentences.length === 0) return "No text to summarize.";

  // Simple extractive summarization - take first, middle, and important sentences
  let numSentences;
  switch (length) {
    case 1:
      numSentences = Math.max(1, Math.floor(sentences.length * 0.2));
      break;
    case 2:
      numSentences = Math.max(2, Math.floor(sentences.length * 0.4));
      break;
    case 3:
      numSentences = Math.max(3, Math.floor(sentences.length * 0.6));
      break;
  }

  numSentences = Math.min(numSentences, sentences.length);

  let selectedSentences = [];

  // Always include first sentence
  selectedSentences.push(sentences[0]);

  if (numSentences > 1) {
    // Add middle sentences
    const step = Math.floor(sentences.length / numSentences);
    for (let i = 1; i < numSentences && i * step < sentences.length; i++) {
      selectedSentences.push(sentences[i * step]);
    }
  }

  // Format based on mode
  switch (mode) {
    case "bullets":
      return selectedSentences.map((s) => "• " + s.trim() + ".").join("\n");
    case "custom":
      return selectedSentences.join(". ") + ".";
    default:
      return selectedSentences.join(". ") + ".";
  }
}

// Summarize function
function summarize() {
  const text = inputText.value.trim();

  if (!text) {
    alert("Please enter some text to summarize.");
    return;
  }

  // Show loading
  outputText.innerHTML =
    '<div class="loading">Generating your summary...</div>';

  // Simulate processing time
  setTimeout(() => {
    const summary = summarizeText(text, currentMode, summaryLength);
    outputText.textContent = summary;
  }, 1000);
}

// Copy to clipboard
function copyToClipboard() {
  navigator.clipboard.writeText(outputText.textContent).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  });
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");

mobileMenuToggle.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

// Event listeners
inputText.addEventListener("input", updateWordCount);
summarizeBtn.addEventListener("click", summarize);
copyBtn.addEventListener("click", copyToClipboard);

// Initialize
updateWordCount();
