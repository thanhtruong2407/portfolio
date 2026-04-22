if (!window.portfolioContent) {
  console.error("Portfolio content not loaded. Ensure content.js is included before app.js.");
}

const content = window.portfolioContent || {};

const featuredProjectsRoot = document.querySelector("[data-featured-projects]");
const otherProjectsRoot = document.querySelector("[data-other-projects]");
const timelineRoot = document.querySelector("[data-timeline]");
const skillGroupsRoot = document.querySelector("[data-skill-groups]");
const certificationsRoot = document.querySelector("[data-certifications]");
const educationRoot = document.querySelector("[data-education]");
const aboutLeadRoot = document.querySelector("[data-about-lead]");
const aboutParagraphsRoot = document.querySelector("[data-about-paragraphs]");
const focusTagsRoot = document.querySelector("[data-focus-tags]");
const aboutPortraitRoot = document.querySelector("[data-about-portrait]");
const aboutImageRoot = document.querySelector("[data-about-image]");
const contactItemsRoot = document.querySelector("[data-contact-items]");

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");

const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const sections = [...document.querySelectorAll("main section[id]")];

const MOON = "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z";
const SUN = "M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zM3 11H2a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm14.66-5.07.71-.71a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41-1.41zM5.63 17.66l-.71.71a1 1 0 0 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 1.41zm11.32 1.41-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1-1.41 1.41zM5.63 6.34 4.92 5.63a1 1 0 0 1 1.41-1.41l.71.71A1 1 0 0 1 5.63 6.34z";

const NAV_SCROLL_OFFSET = 140;
const SCROLLED_THRESHOLD = 12;

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  if (themeIcon) themeIcon.setAttribute("d", theme === "light" ? SUN : MOON);
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTagList(tags = []) {
  if (!Array.isArray(tags)) return "";
  return tags
    .map((tag) => `<span class="${escapeHtml(tag.className)}">${escapeHtml(tag.label)}</span>`)
    .join("");
}

function projectHref(projectId) {
  return `./project.html?id=${encodeURIComponent(projectId)}`;
}

function createFeaturedCard(project) {
  return `
    <article class="project-card reveal overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40">
      <a class="project-trigger group block h-full w-full text-left" href="${projectHref(project.id)}">
        <div class="project-thumb flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-brand-100 via-white to-slate-100 text-5xl font-bold tracking-[-0.05em] text-brand-300 dark:from-brand-500/15 dark:via-slate-900 dark:to-slate-900 dark:text-brand-500/40" aria-hidden="true"><span>${escapeHtml(project.thumb)}</span></div>
        <div class="project-body p-7">
          <p class="project-kicker mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">${escapeHtml(project.role)}</p>
          <h3 class="project-title text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(project.title)}</h3>
          <p class="project-text mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(project.summary)}</p>
          <div class="tag-row mt-5 flex flex-wrap gap-2.5">
            ${renderTagList(project.tags.map((tag) => ({
              ...tag,
              className: `tag inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tag.accent
                ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200"
                : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"}`
            })))}
          </div>
          <span class="card-cta mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 transition group-hover:text-brand-500 dark:text-brand-300 dark:group-hover:text-brand-200">View case study <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>
  `;
}

function createSupportingCard(project) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  return `
    <article class="mini-card reveal overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40">
      <a class="mini-trigger group block h-full w-full text-left" href="${projectHref(project.id)}">
        <div class="mini-body p-6">
          <p class="mini-kicker mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Supporting project</p>
          <h3 class="mini-title text-lg font-semibold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(project.title)}</h3>
          <p class="mini-text mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(project.summary)}</p>
          <div class="tag-row mt-5 flex flex-wrap gap-2.5">
            ${tags.map((tag) => `<span class="tag inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">${escapeHtml(typeof tag === "string" ? tag : tag.label)}</span>`).join("")}
          </div>
          <span class="card-cta mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 transition group-hover:text-brand-500 dark:text-brand-300 dark:group-hover:text-brand-200">Open details <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>
  `;
}

function createTimelineItem(item) {
  return `
    <article class="timeline-item reveal grid gap-6 rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40 lg:grid-cols-[200px_minmax(0,1fr)]">
      <div class="timeline-meta border-b border-slate-200 pb-4 dark:border-slate-800 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        <p class="timeline-period text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">${escapeHtml(item.period)}</p>
        <p class="timeline-company mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.company)}</p>
      </div>
      <div>
        <h3 class="timeline-role text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(item.role)}</h3>
        <ul class="timeline-points mt-4 grid gap-3">
          ${item.points.map((point) => `<li class="relative pl-5 text-sm leading-7 text-slate-600 before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-500 dark:text-slate-300">${escapeHtml(point)}</li>`).join("")}
        </ul>
      </div>
    </article>
  `;
}

function createSkillCard(group) {
  return `
    <article class="skill-card reveal rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40">
      <p class="skill-number mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">${escapeHtml(group.number)}</p>
      <h3 class="skill-title text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(group.title)}</h3>
      <ul class="skill-list mt-5 grid gap-3">
        ${group.items.map((item) => `<li class="relative pl-5 text-sm leading-7 text-slate-600 before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-500 dark:text-slate-300">${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function createCertificationCard(cert) {
  return `
    <article class="cert-card reveal rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40">
      <h3 class="cert-title text-lg font-semibold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(cert.title)}</h3>
      <p class="cert-meta mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(cert.meta)}</p>
    </article>
  `;
}

function createContactItem(item) {
  const tag = item.href ? "a" : "div";
  const href = item.href ? ` href="${escapeHtml(item.href)}"` : "";
  const arrow = item.href
    ? `<span class="contact-arrow text-brand-600 dark:text-brand-300" aria-hidden="true">→</span>`
    : "";
  return `
    <${tag} class="contact-item reveal flex items-center justify-between gap-4 rounded-[1.25rem] border p-5 transition duration-200 ${item.href ? "hover:-translate-y-1" : ""} ${item.featured ? "border-brand-200 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}"${href}>
      <div>
        <span class="contact-label block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.label)}</span>
        <span class="contact-value mt-2 block text-base font-medium text-slate-950 dark:text-white">${escapeHtml(item.value)}</span>
      </div>
      ${arrow}
    </${tag}>
  `;
}

function hydratePage() {
  if (!content.featuredProjects) return;
  if (featuredProjectsRoot) featuredProjectsRoot.innerHTML = content.featuredProjects.map(createFeaturedCard).join("");
  if (otherProjectsRoot) otherProjectsRoot.innerHTML = (content.supportingProjects || []).map(createSupportingCard).join("");
  if (timelineRoot) timelineRoot.innerHTML = (content.timeline || []).map(createTimelineItem).join("");
  if (skillGroupsRoot) skillGroupsRoot.innerHTML = (content.skillGroups || []).map(createSkillCard).join("");
  if (certificationsRoot) certificationsRoot.innerHTML = (content.certifications || []).map(createCertificationCard).join("");
  if (educationRoot) educationRoot.innerHTML = (content.education || []).map(createCertificationCard).join("");
  if (aboutLeadRoot) aboutLeadRoot.textContent = content.aboutLead || "";
  if (aboutParagraphsRoot) {
    aboutParagraphsRoot.innerHTML = (content.aboutParagraphs || [])
      .map((paragraph) => `<p class="about-body text-base leading-8 text-slate-600 dark:text-slate-300">${escapeHtml(paragraph)}</p>`)
      .join("");
  }
  if (focusTagsRoot) {
    focusTagsRoot.innerHTML = (content.focusTags || [])
      .map((tag) => `<span class="focus-tag inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">${escapeHtml(tag)}</span>`)
      .join("");
  }
  if (aboutPortraitRoot && aboutImageRoot) {
    const hasAboutImage = Boolean(content.aboutImageSrc);
    aboutPortraitRoot.hidden = !hasAboutImage;
    if (hasAboutImage) {
      aboutImageRoot.src = content.aboutImageSrc;
      aboutImageRoot.alt = content.aboutImageAlt || "";
    } else {
      aboutImageRoot.removeAttribute("src");
      aboutImageRoot.alt = "";
    }
  }
  if (contactItemsRoot) contactItemsRoot.innerHTML = (content.contactItems || []).map(createContactItem).join("");
}

function syncActiveNav() {
  const offset = window.scrollY + NAV_SCROLL_OFFSET;
  let activeId = sections[0]?.id;
  sections.forEach((section) => {
    if (offset >= section.offsetTop) activeId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

function toggleScrolledNav() {
  if (nav) nav.classList.toggle("is-scrolled", window.scrollY > SCROLLED_THRESHOLD);
}

function toggleMenu(forceState) {
  if (!menu || !menuToggle) return;
  const nextState = typeof forceState === "boolean" ? forceState : !menu.classList.contains("is-open");
  menu.classList.toggle("is-open", nextState);
  menuToggle.setAttribute("aria-expanded", String(nextState));
}

function setupRevealObserver() {
  const revealTargets = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => observer.observe(target));
}

let scrollRafId = null;

function onScroll() {
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    syncActiveNav();
    toggleScrolledNav();
    scrollRafId = null;
  });
}

applyTheme("light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    applyTheme(current === "light" ? "dark" : "light");
  });
}

hydratePage();
setupRevealObserver();
syncActiveNav();
toggleScrolledNav();

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-nav-link]")) toggleMenu(false);
});

window.addEventListener("scroll", onScroll, { passive: true });

if (menuToggle) menuToggle.addEventListener("click", () => toggleMenu());
