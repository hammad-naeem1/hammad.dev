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

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach((section) => observer.observe(section));
  }
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

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

if ("IntersectionObserver" in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

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

  // Keep the first viewport focused on the hero. Start observing only after
  // the page has actually moved, so initial viewport intersections stay hidden.
  let revealStarted = false;
  const startRevealsAfterScroll = () => {
    if (revealStarted || window.scrollY <= 0) return;
    revealStarted = true;
    revealTargets.forEach((element) => revealObserver.observe(element));
    window.removeEventListener("scroll", startRevealsAfterScroll);
  };
  window.addEventListener("scroll", startRevealsAfterScroll, { passive: true });
} else {
  // Keep content available in browsers without IntersectionObserver.
  revealTargets.forEach((element) => element.classList.add("is-revealed"));
}

const rippleSelector = "button, .connect-card, .round-link, .nav-contact, .contact-button";
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
