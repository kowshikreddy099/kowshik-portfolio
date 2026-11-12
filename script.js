(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("#menu-button");
  const navigation = document.querySelector("#primary-navigation");
  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storedTheme = localStorage.getItem("portfolio-theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    const isDark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeIcon.textContent = isDark ? "☼" : "◐";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#101d19" : "#0b1d29");
  }

  setTheme(storedTheme || systemTheme);

  themeButton.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  function setMenu(open) {
    navigation.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.classList.toggle("menu-open", open);
  }

  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) setMenu(false);
  });

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  document.querySelector("[data-year]").textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => observer.observe(item));
})();
