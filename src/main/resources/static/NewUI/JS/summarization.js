const modeButtons = document.querySelectorAll(".mode-btn");
let currentMode = "";
// Mode selection
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

// Summarize function
async function summarize() {
  const text = inputText.value.trim();
  // Show loading indicator
  outputText.innerHTML = '<div class="loading">Loading summary...</div>';

  try {
    let response;
    switch (currentMode) {
      case "paragraph":
        response = await fetch("/summarize", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: text,
        });
        break;
      case "bullets":
        response = await fetch("/summarize/bullets", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: text,
        });
        break;
      case "abstractive":
        response = await fetch("/summarize/abst", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: text,
        });
        break;

      case "classify":
        response = await fetch("/api/classification/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        break;
      default:
        // fallback to paragraph
        response = await fetch("/summarize", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: text,
        });
    }

    if (response.status === 401) {
      alert("Login to summarize more than 200 words.");
      window.location.href = "/NewUI/login";
      return;
    }

    const summaryInfo = await response.json();
    let cleanedSummary =
      summaryInfo.summarizedText ||
      summaryInfo.summary ||
      "No summary available.";

    clearAllTimeouts();
    outputText.innerHTML = "";
    typeWriter(cleanedSummary, outputText, 0, 20);
  } catch (error) {
    outputText.innerHTML = '<div class="loading">Error loading summary.</div>';
    console.error("Error:", error);
  }
}
