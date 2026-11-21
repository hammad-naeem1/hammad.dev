const themeToggle = document.querySelector(".theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const updateThemeControl = (theme) => {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  if (themeColorMeta) themeColorMeta.setAttribute("content", theme === "dark" ? "#0b1017" : "#f4ede0");
};

updateThemeControl(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    updateThemeControl(nextTheme);
    try {
      localStorage.setItem("hammad-theme", nextTheme);
    } catch {
      // The theme still works for this visit if storage is unavailable.
    }
  });
}

const cookieBanner = document.querySelector(".cookie-banner");
if (cookieBanner) {
  let savedCookieChoice = null;
  try {
    savedCookieChoice = localStorage.getItem("hammad-cookie-consent");
  } catch {
    // Consent can still be chosen for this visit if storage is unavailable.
  }

  if (savedCookieChoice) {
    cookieBanner.hidden = true;
  } else {
    cookieBanner.hidden = false;

    const revealCookieBanner = () => {
      window.setTimeout(() => cookieBanner.classList.add("is-visible"), 1200);
    };

    if (document.readyState === "complete") {
      revealCookieBanner();
    } else {
      window.addEventListener("load", revealCookieBanner, { once: true });
    }

    cookieBanner.addEventListener("click", (event) => {
      const choiceButton = event.target.closest("[data-cookie-choice]");
      if (!choiceButton || !cookieBanner.classList.contains("is-visible")) return;

      try {
        localStorage.setItem("hammad-cookie-consent", choiceButton.dataset.cookieChoice);
      } catch {
        // The banner still dismisses for this visit if storage is unavailable.
      }

      const hideAfterTransition = (transitionEvent) => {
        if (transitionEvent.target !== cookieBanner || transitionEvent.propertyName !== "opacity") return;
        cookieBanner.removeEventListener("transitionend", hideAfterTransition);
        cookieBanner.hidden = true;
      };

      cookieBanner.addEventListener("transitionend", hideAfterTransition);
      cookieBanner.classList.remove("is-visible");
      window.setTimeout(() => {
        cookieBanner.removeEventListener("transitionend", hideAfterTransition);
        cookieBanner.hidden = true;
      }, 600);
    });
  }
}

const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

if (menuButton && primaryNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateActiveNav = () => {
  const focusLine = Math.min(window.innerHeight * 0.32, 250);
  const currentSection = sections
    .filter((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= focusLine && bounds.bottom > focusLine;
    })
    .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];

  navLinks.forEach((link) => {
    if (currentSection && link.hash === `#${currentSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateActiveNav);
updateActiveNav();

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const progressFill = document.querySelector(".scroll-progress span");
const updateScrollProgress = () => {
  if (!progressFill) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.max(0, Math.min(window.scrollY / scrollable, 1)) : 0;
  progressFill.style.transform = `scaleX(${progress})`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const revealSelector = [
  "main > section:not(.hero)",
  ".site-footer",
  ".section-kicker",
  "main > section:not(.hero) h2",
  "main > section:not(.hero) h3",
  ".about-grid > *",
  ".fields-heading > *",
  ".field-row",
  ".fields-footnote",
  ".projects-heading > *",
  ".empty-projects > *",
  ".project-format",
  ".notes-grid > *",
  ".notes-intro > *",
  ".deployment-panel > *",
  ".deployment-spec > div",
  ".connect-heading > *",
  ".connect-card",
  ".contact-inner > *",
  ".footer-main > *",
  ".footer-bottom > *"
].join(",");
const revealTargets = [...document.querySelectorAll(revealSelector)];
const popTargets = [...document.querySelectorAll("button:not(.theme-toggle), .nav-contact, .text-link, .round-link, .connect-card, .contact-button")];
const spotlightCards = [...document.querySelectorAll(".hero-note, .field-row, .empty-projects, .notebook-empty, .deployment-panel, .connect-card")];

spotlightCards.forEach((card) => {
  card.classList.add("spotlight-card");
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
  });
});

if ("IntersectionObserver" in window && (revealTargets.length || popTargets.length)) {
  revealTargets.forEach((element) => element.classList.add("scroll-reveal"));

  const staggerGroups = [
    ".field-list > *",
    ".connect-grid > *",
    ".deployment-spec > div",
    ".about-grid > *",
    ".projects-heading > *",
    ".empty-projects > *",
    ".notes-grid > *",
    ".deployment-panel > *",
    ".contact-inner > *",
    ".footer-main > *",
    ".footer-bottom > *"
  ];
  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.classList.contains("scroll-reveal")) {
        element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 90}ms`);
      }
    });
  });

  const revealSet = new Set(revealTargets);
  const popSet = new Set(popTargets);
  const observerTargets = new Set([...revealTargets, ...popTargets]);
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, isIntersecting } = entry;

      if (revealSet.has(target)) {
        target.classList.toggle("visible", isIntersecting);
      }
      if (popSet.has(target)) {
        target.classList.toggle("scroll-pop", isIntersecting);
      }
    });
  }, { threshold: 0, rootMargin: "0px" });

  observerTargets.forEach((element) => revealObserver.observe(element));
} else {
  // Keep all content available where IntersectionObserver is unavailable.
  revealTargets.forEach((element) => element.classList.add("scroll-reveal", "visible"));
}

const rippleSelector = "button:not(.theme-toggle), .connect-card, .round-link, .nav-contact, .contact-button";
document.addEventListener("click", (event) => {
  const control = event.target.closest(rippleSelector);
  if (!control) return;

  const bounds = control.getBoundingClientRect();
  const diameter = Math.ceil(Math.hypot(bounds.width, bounds.height) * 1.5);
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - bounds.left - diameter / 2}px`;
  ripple.style.top = `${event.clientY - bounds.top - diameter / 2}px`;
  control.append(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  window.setTimeout(() => ripple.remove(), 800);
});
