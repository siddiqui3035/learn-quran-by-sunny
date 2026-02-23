// nav-init.js — injects shared nav HTML and wires up hamburger + dark mode
// Works with file://, http://, and https:// — no fetch/SSI needed.
(function () {
  const NAV_HTML = `
<div class="logo">
  <div class="logo-icon">
    <a href="index.html">
      <img src="logo.png" width="100px" alt="Taealam alquran" />
    </a>
  </div>
</div>
<div class="hamburger-menu" id="hamburger-menu">
  <span></span>
  <span></span>
  <span></span>
</div>
<nav id="nav-menu">
  <ul>
    <li><a href="hijri-calander.html">Hijri Calendar</a></li>
    <li><a href="moon-age.html">Moon Age</a></li>
    <li><a href="live-haramain.html">Live Haramain</a></li>
    <li><a href="zakat-calculator.html">Zakat Calculator</a></li>
    <li><a href="islamic-events.html">Islamic Events</a></li>
    <li><a href="ramadan-calendar.html">Ramadan Calendar</a></li>
  </ul>
  <div class="dark-mode-toggle">
    <span class="toggle-icon">☀️</span>
    <label class="toggle-switch">
      <input type="checkbox" id="dark-mode-toggle" />
      <span class="toggle-slider"></span>
    </label>
  </div>
</nav>`;

  // Inject into every .header-container on the page
  const container = document.querySelector(".header-container");
  if (container) container.innerHTML = NAV_HTML;

  // ── Hamburger ──────────────────────────────────────────────────
  const hamburger = document.getElementById("hamburger-menu");
  const menu = document.getElementById("nav-menu");
  if (hamburger && menu) {
    hamburger.addEventListener("click", () => menu.classList.toggle("active"));
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("active"))
    );
  }

  // ── Active link highlight ──────────────────────────────────────
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav-menu ul a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("#")[0];
    if (href === currentPage) a.classList.add("active");
  });

  // ── Dark Mode ──────────────────────────────────────────────────
  const toggle = document.getElementById("dark-mode-toggle");
  const icon = document.querySelector(".toggle-icon");

  function applyDark(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
    if (toggle) toggle.checked = enabled;
    if (icon) icon.textContent = enabled ? "🌙" : "☀️";
  }

  applyDark(localStorage.getItem("darkMode") === "enabled");

  if (toggle) {
    toggle.addEventListener("change", () => {
      const on = toggle.checked;
      localStorage.setItem("darkMode", on ? "enabled" : "disabled");
      applyDark(on);
      // Hijri calendar page: sync iframe theme
      const iframe = document.querySelector("#hijri-calendar iframe");
      if (iframe) {
        const base = "https://www.searchtruth.com/hijri/hijriCalendar.php";
        iframe.src = on ? base + "?theme=dark" : base;
      }
    });
  }

  // ── Dynamic Copyright Year ──────────────────────────────────────
  const copyrightEl = document.querySelector(".copyright");
  if (copyrightEl) {
    const currentYear = new Date().getFullYear();
    // Replaces the first 4-digit number found in the text with the current year
    copyrightEl.innerHTML = copyrightEl.innerHTML.replace(/\d{4}/, currentYear);
  }
})();
