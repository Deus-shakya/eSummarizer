const DARK_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 12H1M23 12h-4M7.05 7.05L4.222 4.222M19.778 19.778L16.95 16.95M7.05 16.95L4.222 19.778M19.778 4.222L16.95 7.05" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.16"/>
  <path d="M12 19v4M12 1v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;

const LIGHT_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M31.75,6.479c6.7339,3.8881,10.3177,11.5721,8.969,19.23-1.3496,7.6616-7.3484,13.6604-15.01,15.01-7.6579,1.3487-15.3419-2.2351-19.23-8.969"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M32.02,6.75c4.1858,7.2511,2.98,16.4095-2.94,22.33-5.9205,5.92-15.0789,7.1258-22.33,2.94"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10,8v4"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8,10h4"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12,18v3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10.5,19.5h3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M30.5,14v3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M29,15.5h3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M38.5,5.5v3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M37,7h3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7.5,41h3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9,39.5v3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M39.5,36h3"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M41,34.5l.02,3"/>
</svg>
`;

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("theme-toggle");

  // Detect system preference if no user choice
  if (!localStorage.getItem("theme")) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark-mode");
      if (toggle) toggle.innerHTML = DARK_SVG;
    } else {
      document.body.classList.remove("dark-mode");
      if (toggle) toggle.innerHTML = LIGHT_SVG;
    }
  } else if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (toggle) toggle.innerHTML = DARK_SVG;
  } else {
    document.body.classList.remove("dark-mode");
    if (toggle) toggle.innerHTML = LIGHT_SVG;
  }

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggle.innerHTML = DARK_SVG;
    } else {
      localStorage.setItem("theme", "light");
      toggle.innerHTML = LIGHT_SVG;
    }
  });

  // Listen for system theme changes if no user choice
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        document.body.classList.toggle("dark-mode", e.matches);
        if (toggle) toggle.textContent = e.matches ? LIGHT_SVG : DARK_SVG;
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
