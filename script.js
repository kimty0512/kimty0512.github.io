
const body = document.body;
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
const currentYear = document.querySelector("#current-year");

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    body.classList.add("is-ready");
  });
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  mainNav.classList.remove("is-open");
  body.classList.remove("menu-open");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    mainNav.classList.toggle("is-open", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });
}

/* Fade the current page out before opening another internal HTML page. */
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  const target = link.getAttribute("target");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:") ||
    target === "_blank" ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const url = new URL(link.href, window.location.href);

  if (url.origin !== window.location.origin) return;
  if (!url.pathname.endsWith(".html") && url.pathname !== "/") return;

  event.preventDefault();
  closeMenu();
  body.classList.add("is-leaving");

  window.setTimeout(() => {
    window.location.href = url.href;
  }, 250);
});

/* Reveal lower-page content when it enters the viewport. */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

/* Prevent a cached page from remaining faded when the Back button is used. */
window.addEventListener("pageshow", () => {
  body.classList.remove("is-leaving");
  body.classList.add("is-ready");
});
