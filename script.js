const navItems = [
  ["01", "Announcement", "announcement.html", "announcement"],
  ["02", "Research", "research.html", "research"],
  ["03", "Project", "projects.html", "projects"],
  ["04", "Professor", "professor.html", "professor"],
  ["05", "Member", "members.html", "members"],
  ["06", "Alumni", "alumni.html", "alumni"],
  ["07", "Publications", "publications.html", "publications"],
  ["08", "Gallery", "gallery.html", "gallery"],
  ["09", "Contact Info", "contact.html", "contact"],
];

const body = document.body;
const page = body.dataset.page || "home";

function renderHeader() {
  const target = document.querySelector("#site-header");
  if (!target) return;

  const links = navItems
    .map(
      ([number, label, href, key]) => `
        <a href="${href}"${page === key ? ' class="is-active" aria-current="page"' : ""}>
          <small>${number}</small><strong>${label}</strong>
        </a>`,
    )
    .join("");

  target.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header" id="site-header-bar">
      <div class="header-inner">
        <a class="site-logo" href="index.html" aria-label="SB LAB home">
          <img class="logo-white" src="assets/site/dgist-logo-white.png" alt="DGIST">
          <img class="logo-color" src="assets/site/dgist-logo-color.png" alt="DGIST">
        </a>
        <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu-panel">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <div class="menu-panel" id="menu-panel" aria-hidden="true">
      <div class="menu-panel-inner">
        <p class="menu-kicker">Lab of Neurodegenerative Diseases and Aging</p>
        <nav class="main-nav" aria-label="Main navigation">${links}</nav>
      </div>
    </div>`;
}

function renderFooter() {
  const target = document.querySelector("#site-footer");
  if (!target) return;

  target.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-main">
          <a class="footer-logo" href="index.html" aria-label="SB LAB home">
            <img src="assets/site/sb-lab-logo.png" alt="SB LAB">
          </a>
          <div class="footer-details">
            <p><strong>E-mail</strong><a href="mailto:sblee@dgist.ac.kr">sblee@dgist.ac.kr</a></p>
            <p><strong>연구실번호</strong>Lab : +82.53.785.6128<br>Office : +82.53.785.6122</p>
            <p class="footer-address"><strong>주소</strong>[42988] 대구광역시 달성군 현풍읍 테크노중앙대로 333 대구경북과학기술원 (DGIST)<br>Lab : E4, Room 420 &nbsp;·&nbsp; Office : E4, Room 413</p>
          </div>
        </div>
        <p class="footer-bottom">COPYRIGHT © <span id="current-year"></span> 대구경북과학기술원(DGIST). All rights reserved.</p>
      </div>
    </footer>
    <button class="back-to-top" id="back-to-top" type="button" aria-label="Back to top">↑</button>`;
}

renderHeader();
renderFooter();

const siteHeader = document.querySelector("#site-header-bar");
const menuToggle = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector("#menu-panel");
const backToTop = document.querySelector("#back-to-top");
const currentYear = document.querySelector("#current-year");

if (currentYear) currentYear.textContent = new Date().getFullYear();

function setMenu(open) {
  if (!menuToggle || !menuPanel) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuPanel.setAttribute("aria-hidden", String(!open));
  menuPanel.classList.toggle("is-open", open);
  body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

menuPanel?.addEventListener("click", (event) => {
  if (event.target === menuPanel) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

function updateChrome() {
  const scrolled = window.scrollY > 36;
  siteHeader?.classList.toggle("is-scrolled", scrolled);
  backToTop?.classList.toggle("is-visible", window.scrollY > 600);
}

window.addEventListener("scroll", updateChrome, { passive: true });
updateChrome();

backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Home hero slider */
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dot")];
let activeHero = 0;
let heroTimer;

function showHero(index) {
  if (!heroSlides.length) return;
  activeHero = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeHero));
  heroDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === activeHero);
    dot.setAttribute("aria-selected", String(i === activeHero));
  });
}

function restartHeroTimer() {
  window.clearInterval(heroTimer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  heroTimer = window.setInterval(() => showHero(activeHero + 1), 6500);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showHero(index);
    restartHeroTimer();
  });
});

if (heroSlides.length) {
  showHero(0);
  restartHeroTimer();
}

/* Category filter controls */
document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const targetSelector = group.dataset.filterGroup;
  const targets = [...document.querySelectorAll(targetSelector)];

  group.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      group.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      targets.forEach((target) => {
        target.hidden = filter !== "all" && target.dataset.category !== filter;
      });
    });
  });
});

/* Client-side list search */
document.querySelectorAll("[data-search-target]").forEach((input) => {
  const targets = [...document.querySelectorAll(input.dataset.searchTarget)];
  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase();
    targets.forEach((target) => {
      target.hidden = Boolean(query) && !target.textContent.toLocaleLowerCase().includes(query);
    });
  });
});

/* Reveal on scroll */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.09, rootMargin: "0px 0px -35px" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
