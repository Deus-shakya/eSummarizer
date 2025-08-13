document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("theme-toggle");

  // Detect system preference if no user choice
  if (!localStorage.getItem("theme")) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark-mode");
      if (toggle) toggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      if (toggle) toggle.textContent = "🌙";
    }
  } else if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (toggle) toggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    if (toggle) toggle.textContent = "🌙";
  }

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggle.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggle.textContent = "🌙";
    }
  });

  // Listen for system theme changes if no user choice
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        document.body.classList.toggle("dark-mode", e.matches);
        if (toggle) toggle.textContent = e.matches ? "☀️" : "🌙";
      }
    });

  // Hamburger menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  mobileToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    mobileToggle.classList.toggle("open");
  });
});
