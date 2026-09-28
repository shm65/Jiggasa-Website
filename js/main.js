/* Jiggasha — shared behaviour: theme, mobile menu, live clock, service worker.
   Safe to include on every page: it only touches elements that exist, and it
   uses capture-phase handlers so older inline scripts on other pages can't
   double-toggle the theme or menu. */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "jiggasha_theme";

  /* ---------- Theme ---------- */
  function getTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t === "dark" || t === "light") return t;
    } catch (e) {}
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.getElementById("theme-btn");
    if (btn) {
      btn.innerHTML = theme === "dark" ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
      btn.setAttribute("aria-pressed", theme === "dark");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b1120" : "#4f46e5");
  }

  function setTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    applyTheme(theme);
  }

  applyTheme(getTheme());

  // Follow the OS setting until the user picks a theme themselves
  if (window.matchMedia) {
    var mq = matchMedia("(prefers-color-scheme: dark)");
    var onSystem = function (e) {
      var saved = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch (err) {}
      if (!saved) applyTheme(e.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  }

  // Keep tabs in sync
  window.addEventListener("storage", function (e) {
    if (e.key === THEME_KEY) applyTheme(getTheme());
  });

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    var menu = document.getElementById("mobile-menu");
    var toggle = document.getElementById("menu-toggle");
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="ph ph-list"></i>';
  }

  // One delegated, capture-phase click handler for theme + menu
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    if (t.closest("#theme-btn")) {
      e.stopPropagation();
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      return;
    }

    var toggle = t.closest("#menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (toggle && menu) {
      e.stopPropagation();
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
      return;
    }

    if (menu && menu.classList.contains("open") && !t.closest("#mobile-menu")) closeMenu();
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Live clock & date (only if present on the page) ---------- */
  var clockEl = document.getElementById("live-clock");
  var dateEl = document.getElementById("live-date");
  if (clockEl && dateEl) {
    var timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    var dateFmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    var lastDate = "";
    var tick = function () {
      var now = new Date();
      clockEl.textContent = timeFmt.format(now).toUpperCase();
      var d = dateFmt.format(now);
      if (d !== lastDate) { dateEl.textContent = d; lastDate = d; }
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Random inspirational quote (new one on every load) ---------- */
  var quoteEl = document.getElementById("quote-text");
  var authorEl = document.getElementById("quote-author");
  if (quoteEl && authorEl) {
    var QUOTES = [
      ["Education is the most powerful weapon which you can use to change the world.", "Nelson Mandela"],
      ["Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action.", "Dr. A.P.J. Abdul Kalam"],
      ["Arise, awake, and stop not till the goal is reached.", "Swami Vivekananda"],
      ["Education is the manifestation of the perfection already in man.", "Swami Vivekananda"],
      ["The beautiful thing about learning is that no one can take it away from you.", "B.B. King"],
      ["Education is not the learning of facts, but the training of the mind to think.", "Albert Einstein"],
      ["It's not that I'm so smart, it's just that I stay with problems longer.", "Albert Einstein"],
      ["Success is the sum of small efforts, repeated day in and day out.", "Robert Collier"],
      ["An investment in knowledge pays the best interest.", "Benjamin Franklin"],
      ["Learning never exhausts the mind.", "Leonardo da Vinci"],
      ["The roots of education are bitter, but the fruit is sweet.", "Aristotle"]
    ];
    var idx = Math.floor(Math.random() * QUOTES.length);
    try {
      // never show the same quote twice in a row
      var last = parseInt(localStorage.getItem("jiggasha_last_quote"), 10);
      if (QUOTES.length > 1 && idx === last) idx = (idx + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length;
      localStorage.setItem("jiggasha_last_quote", String(idx));
    } catch (e) {}
    quoteEl.textContent = "\u201C" + QUOTES[idx][0] + "\u201D";
    authorEl.textContent = "\u2014 " + QUOTES[idx][1];
  }

  /* ---------- Service worker (PWA) ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/service-worker.js", { updateViaCache: "none" })
        .then(function (reg) {
          reg.update(); // always look for a newer worker on page load
        })
        .catch(function (err) {
          console.log("Service Worker registration failed:", err);
        });

      // When a new worker takes over, reload once so stale cached CSS/JS is replaced
      var reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (reloaded) return;
        reloaded = true;
        window.location.reload();
      });
    });
  }
})();