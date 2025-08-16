// Get DOM elements
const inputText = document.getElementById("inputText");
const wordCount = document.getElementById("wordCount");
const summarizeBtn = document.getElementById("summarizeBtn");
const outputSection = document.getElementById("outputSection");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const lengthSlider = document.getElementById("lengthSlider");
const fileInput = document.getElementById("fileInput");

let typingTimeouts = [];
let isClearing = false;

// Update word count
function updateWordCount() {
  const text = inputText.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const sentences = text
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0;
  wordCount.textContent = `${sentences} sentences • ${words} words`;
}

updateWordCount();

// Length slider
lengthSlider.addEventListener("input", (e) => {
  summaryLength = parseInt(e.target.value);
});

if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    alert("Only for Paragraph mode!");
    if (confirm("Is MODE: Paragraph?")) {
      const file = e.target.files[0];
      if (file) {
        alert("Uploading....");
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/summarize/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("File upload failed");
          }

          const result = await response.json();
          outputText.innerHTML = "";
          const summary = result.summarizedText;
          clearAllTimeouts();
          typeWriter(summary, outputText, 0, 1);

          alert("File uploaded and processed!");
          e.target.value = "";
        } catch (error) {
          alert("Error uploading file: " + error.message);
          e.target.value = "";
        }
      }
    }
  });
}

// Event listeners
inputText.addEventListener("input", updateWordCount);
summarizeBtn.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission
  summarize();
});
copyBtn.addEventListener("click", copyToClipboard);

// clear all timeouts
function clearAllTimeouts() {
  for (const timeoutId of typingTimeouts) {
    clearTimeout(timeoutId);
    isClearing = false;
  }
  typingTimeouts = [];
}

// type writer function
function typeWriter(text, element, index, speed) {
  // Scroll into view only at the start
  if (index === 0) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  // If the text contains HTML tags, render it directly
  if (/<ul>|<li>/.test(text)) {
    element.innerHTML = text;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (isClearing) return;
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    index++;
    const timeoutId = setTimeout(function () {
      typeWriter(text, element, index, speed);
    }, speed);
    typingTimeouts.push(timeoutId);
  } else {
    // Scroll into view at the end
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
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
