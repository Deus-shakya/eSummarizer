document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    toggle.textContent = document.body.classList.contains("dark-mode")
      ? "☀️"
      : "🌙";
  });

  // Hamburger menu toggle (now inside DOMContentLoaded)
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  mobileToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    mobileToggle.classList.toggle("open");
  });
});
