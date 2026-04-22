if (!window.portfolioContent) {
  console.error("Portfolio content not loaded. Ensure content.js is included before app.js.");
}
const content = window.portfolioContent || {};

const featuredProjectsRoot = document.querySelector("[data-featured-projects]");
const otherProjectsRoot    = document.querySelector("[data-other-projects]");
const timelineRoot         = document.querySelector("[data-timeline]");
const skillGroupsRoot      = document.querySelector("[data-skill-groups]");
const certificationsRoot   = document.querySelector("[data-certifications]");
const educationRoot        = document.querySelector("[data-education]");
const aboutLeadRoot        = document.querySelector("[data-about-lead]");
const aboutParagraphsRoot  = document.querySelector("[data-about-paragraphs]");
const focusTagsRoot        = document.querySelector("[data-focus-tags]");
const aboutPortraitRoot    = document.querySelector("[data-about-portrait]");
const aboutImageRoot       = document.querySelector("[data-about-image]");
const contactItemsRoot     = document.querySelector("[data-contact-items]");

const popup            = document.getElementById("project-popup");
const popupBody        = document.querySelector("[data-popup-body]");
const popupIndex       = document.querySelector("[data-popup-index]");
const popupTags        = document.querySelector("[data-popup-tags]");
const popupTitle       = document.querySelector("[data-popup-title]");
const popupRole        = document.querySelector("[data-popup-role]");
const popupSummary     = document.querySelector("[data-popup-summary]");
const popupMeta        = document.querySelector("[data-popup-meta]");
const popupSections    = document.querySelector("[data-popup-sections]");
const popupOutcomesLabel = document.querySelector("[data-popup-outcomes-label]");
const popupOutcomes    = document.querySelector("[data-popup-outcomes]");
const popupProgress    = document.querySelector("[data-popup-progress]");
const popupCloseButtons = document.querySelectorAll("[data-popup-close]");

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon   = document.querySelector("[data-theme-icon]");

const MOON = "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z";
const SUN  = "M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zM3 11H2a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm14.66-5.07.71-.71a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41-1.41zM5.63 17.66l-.71.71a1 1 0 0 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 1.41zm11.32 1.41-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1-1.41 1.41zM5.63 6.34 4.92 5.63a1 1 0 0 1 1.41-1.41l.71.71A1 1 0 0 1 5.63 6.34z";

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  if (themeIcon) themeIcon.setAttribute("d", theme === "light" ? SUN : MOON);
  if (themeToggle) themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
}

applyTheme("light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    applyTheme(current === "light" ? "dark" : "light");
  });
}

const nav        = document.querySelector("[data-nav]");
const navLinks   = document.querySelectorAll("[data-nav-link]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu       = document.querySelector("[data-menu]");
const sections   = [...document.querySelectorAll("main section[id]")];

const NAV_SCROLL_OFFSET = 140;
const SCROLLED_THRESHOLD = 12;

let lastFocusedElement = null;

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

function createFeaturedCard(project) {
  return `
    <article class="project-card reveal overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40">
      <button class="project-trigger group w-full text-left" type="button" data-project-id="${escapeHtml(project.id)}">
        <div class="project-thumb flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-brand-100 via-white to-slate-100 text-5xl font-bold tracking-[-0.05em] text-brand-300 dark:from-brand-500/15 dark:via-slate-900 dark:to-slate-900 dark:text-brand-500/40" aria-hidden="true"><span>${escapeHtml(project.thumb)}</span></div>
        <div class="project-body p-7">
          <p class="project-kicker mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">${escapeHtml(project.role)}</p>
          <h3 class="project-title text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(project.title)}</h3>
          <p class="project-text mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(project.summary)}</p>
          <div class="tag-row mt-5 flex flex-wrap gap-2.5">
            ${renderTagList(project.tags.map((tag) => ({ ...tag, className: "tag inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] " + (tag.accent ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200" : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300") })))}
          </div>
          <span class="card-cta mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 transition group-hover:text-brand-500 dark:text-brand-300 dark:group-hover:text-brand-200">View case study <span aria-hidden="true">→</span></span>
        </div>
      </button>
    </article>
  `;
}

function createSupportingCard(project) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  return `
    <article class="mini-card reveal overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40">
      <button class="mini-trigger group w-full text-left" type="button" data-project-id="${escapeHtml(project.id)}">
        <div class="mini-body p-6">
          <p class="mini-kicker mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Supporting project</p>
          <h3 class="mini-title text-lg font-semibold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(project.title)}</h3>
          <p class="mini-text mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(project.summary)}</p>
          <div class="tag-row mt-5 flex flex-wrap gap-2.5">
            ${tags.map((tag) => `<span class="tag inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">${escapeHtml(typeof tag === "string" ? tag : tag.label)}</span>`).join("")}
          </div>
          <span class="card-cta mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 transition group-hover:text-brand-500 dark:text-brand-300 dark:group-hover:text-brand-200">Open details <span aria-hidden="true">→</span></span>
        </div>
      </button>
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

function createPopupCard(card) {
  return `
    <article class="popup-card rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <p class="popup-card-label mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(card.label)}</p>
      <p class="popup-card-body text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(card.body)}</p>
    </article>
  `;
}

function createPopupBulletList(items = []) {
  if (!Array.isArray(items) || !items.length) return "";
  return `
    <ul class="popup-bullet-list grid gap-3">
      ${items.map((item) => `<li class="popup-bullet-item relative pl-5 text-sm leading-7 text-slate-600 before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-500 dark:text-slate-300">${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function createStepCard(step, index) {
  return `
    <article class="step-card overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 sm:grid sm:grid-cols-[64px_minmax(0,1fr)]">
      <div class="step-number flex items-center justify-center border-b border-slate-200 bg-brand-50 px-4 py-4 text-lg font-bold tracking-[-0.03em] text-brand-700 dark:border-slate-800 dark:bg-brand-500/10 dark:text-brand-200 sm:border-b-0 sm:border-r">${String(index + 1).padStart(2, "0")}</div>
      <div class="step-content p-6">
        <h4 class="step-title text-base font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(step.title)}</h4>
        <p class="step-text mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(step.text)}</p>
      </div>
    </article>
  `;
}

function createOutcomeCard(item) {
  return `
    <article class="outcome-card rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <p class="outcome-value text-4xl font-bold tracking-[-0.04em] text-brand-600 dark:text-brand-300">${escapeHtml(item.value)}</p>
      <p class="outcome-label mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.label)}</p>
    </article>
  `;
}

function createPopupSection(section, index) {
  const body = Array.isArray(section.body) ? section.body : section.body ? [section.body] : [];
  const cards = Array.isArray(section.cards) ? section.cards : [];
  const bullets = Array.isArray(section.bullets) ? section.bullets : [];
  const steps = Array.isArray(section.steps) ? section.steps : [];
  const badge = section.badge
    ? `<p class="dynamic-badge mb-6 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">${escapeHtml(section.badge)}</p>`
    : "";

  return `
    <section class="popup-section px-4 py-12 sm:px-6 lg:px-8${index === 0 ? " border-b border-slate-200 dark:border-slate-800" : ""}">
      <div class="mx-auto w-full max-w-7xl">
        <div class="popup-section-head mb-7 flex gap-4">
          <p class="popup-section-index min-w-10 text-3xl font-bold tracking-[-0.04em] text-slate-300 dark:text-slate-700">${String(index + 1).padStart(2, "0")}</p>
          <div>
            ${section.label ? `<p class="popup-section-label mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">${escapeHtml(section.label)}</p>` : ""}
            <h3 class="popup-section-title text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(section.title || "")}</h3>
          </div>
        </div>
        ${badge}
        ${body.map((paragraph) => `<p class="popup-body-text mb-5 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300">${escapeHtml(paragraph)}</p>`).join("")}
        ${cards.length ? `<div class="popup-card-grid grid gap-5 lg:grid-cols-2">${cards.map(createPopupCard).join("")}</div>` : ""}
        ${bullets.length ? `<div class="popup-list-wrap mt-1">${createPopupBulletList(bullets)}</div>` : ""}
        ${steps.length ? `<div class="step-list grid gap-4">${steps.map(createStepCard).join("")}</div>` : ""}
      </div>
    </section>
  `;
}

function getPopupSections(project) {
  if (Array.isArray(project.popupSections) && project.popupSections.length) return project.popupSections;
  return [
    {
      label: "Overview",
      title: "Project framing and responsibility",
      body: project.overview,
      cards: project.overviewCards,
    },
    {
      label: project.dynamicLabel,
      title: project.dynamicTitle,
      badge: project.dynamicBadge,
      steps: project.steps,
    }
  ];
}

function hydratePage() {
  if (!content.featuredProjects)  return;
  if (featuredProjectsRoot)  featuredProjectsRoot.innerHTML  = content.featuredProjects.map(createFeaturedCard).join("");
  if (otherProjectsRoot)     otherProjectsRoot.innerHTML     = (content.supportingProjects || []).map(createSupportingCard).join("");
  if (timelineRoot)          timelineRoot.innerHTML          = (content.timeline || []).map(createTimelineItem).join("");
  if (skillGroupsRoot)       skillGroupsRoot.innerHTML       = (content.skillGroups || []).map(createSkillCard).join("");
  if (certificationsRoot)    certificationsRoot.innerHTML    = (content.certifications || []).map(createCertificationCard).join("");
  if (educationRoot)         educationRoot.innerHTML         = (content.education || []).map(createCertificationCard).join("");
  if (aboutLeadRoot)         aboutLeadRoot.textContent       = content.aboutLead || "";
  if (aboutParagraphsRoot)   aboutParagraphsRoot.innerHTML   = (content.aboutParagraphs || []).map((paragraph) => `<p class="about-body text-base leading-8 text-slate-600 dark:text-slate-300">${escapeHtml(paragraph)}</p>`).join("");
  if (focusTagsRoot)         focusTagsRoot.innerHTML         = (content.focusTags || []).map((tag) => `<span class="focus-tag inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">${escapeHtml(tag)}</span>`).join("");
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
  if (contactItemsRoot)      contactItemsRoot.innerHTML      = (content.contactItems || []).map(createContactItem).join("");
}

function createPlaceholderProjectFromSupporting(project) {
  return {
    id: project.id,
    thumb: "Work",
    role: "Supporting project",
    title: project.title,
    summary: project.summary,
    tags: (project.tags || []).map((tag, index) => ({
      label: typeof tag === "string" ? tag : tag.label,
      accent: index === 0,
    })),
    navIndex: "Supporting Projects",
    roleDetail: "Placeholder detail shell",
    description: project.summary,
    timeline: "To be updated",
    duration: "TBD",
    overview: "Replace this area with a concise explanation of the project context and why it matters to the overall portfolio narrative.",
    overviewCards: [
      { label: "Why it matters",   body: "Explain how the project strengthens the AI, fintech, SaaS, or systems story." },
      { label: "What to add later", body: "Replace with verified scope, collaborators, constraints, and outcomes." },
    ],
    dynamicLabel: "Project type",
    dynamicTitle: "Supporting project structure",
    dynamicBadge: "Placeholder",
    steps: [
      { title: "Context",              text: "Summarize the product, workflow, or feature context." },
      { title: "Contribution",         text: "Describe the part Thanh owned, influenced, or supported." },
      { title: "Learning or impact",   text: "Explain what the project demonstrates for the overall positioning." },
    ],
    outcomes: [
      { value: "TBD", label: "Scope" },
      { value: "TBD", label: "Impact" },
    ],
  };
}

function getProjectById(id) {
  const featured = (content.featuredProjects || []).find((p) => p.id === id);
  if (featured) return featured;
  const supporting = (content.supportingProjects || []).find((p) => p.id === id);
  return supporting ? createPlaceholderProjectFromSupporting(supporting) : null;
}

function openPopup(projectId, triggerElement) {
  const project = getProjectById(projectId);
  if (!project || !popup) return;

  lastFocusedElement = triggerElement;

  if (popupIndex)        popupIndex.textContent = project.navIndex;
  if (popupTags)         popupTags.innerHTML = renderTagList(project.tags.map((tag) => ({
    ...tag,
    className: tag.accent
      ? "inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200"
      : "inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
  })));
  if (popupTitle)        popupTitle.textContent = project.title;
  if (popupRole)         popupRole.textContent = `${project.role} → ${project.roleDetail}`;
  if (popupSummary)      popupSummary.textContent = project.description;
  if (popupMeta) {
    const metaCards = [
      { label: "Timeline", value: project.timeline },
      { label: "Company", value: project.company },
      { label: "Duration", value: project.duration },
    ].filter((item) => item.value);
    popupMeta.innerHTML = `
      ${metaCards.map((item) => `
        <div class="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/80">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.label)}</p>
          <p class="mt-2 text-base font-medium text-slate-950 dark:text-white">${escapeHtml(item.value)}</p>
        </div>
      `).join("")}
      <div class="flex aspect-[5/4] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-brand-100 via-white to-slate-100 text-4xl font-bold tracking-[-0.04em] text-brand-300 dark:border-slate-800 dark:from-brand-500/15 dark:via-slate-900 dark:to-slate-900 dark:text-brand-500/40" aria-hidden="true">
        <span>${escapeHtml(project.thumb)}</span>
      </div>
    `;
  }
  if (popupSections)       popupSections.innerHTML = getPopupSections(project).map(createPopupSection).join("");
  if (popupOutcomesLabel)  popupOutcomesLabel.textContent = project.outcomesLabel || "Outcomes / placeholders";
  if (popupOutcomes)       popupOutcomes.innerHTML = project.outcomes.map(createOutcomeCard).join("");

  popup.classList.add("is-open");
  popup.setAttribute("aria-hidden", "false");
  document.body.classList.add("popup-open");
  if (popupBody) {
    popupBody.scrollTop = 0;
    popupBody.focus();
  }
  if (popupProgress) popupProgress.style.width = "0%";
}

function closePopup() {
  if (!popup) return;
  popup.classList.remove("is-open");
  popup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("popup-open");
  if (popupProgress) popupProgress.style.width = "0%";

  if (lastFocusedElement instanceof HTMLElement && document.body.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
}

function updatePopupProgress() {
  if (!popupBody || !popupProgress) return;
  const maxScroll = popupBody.scrollHeight - popupBody.clientHeight;
  const percentage = maxScroll > 0 ? (popupBody.scrollTop / maxScroll) * 100 : 0;
  popupProgress.style.width = `${percentage}%`;
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
    revealTargets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((t) => observer.observe(t));
}

/* throttle scroll handler to once per animation frame */
let scrollRafId = null;
function onScroll() {
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    syncActiveNav();
    toggleScrolledNav();
    scrollRafId = null;
  });
}

hydratePage();
setupRevealObserver();
syncActiveNav();
toggleScrolledNav();

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-project-id]");
  if (trigger) openPopup(trigger.dataset.projectId, trigger);
  if (event.target === popup) closePopup();
  if (event.target.closest("[data-nav-link]")) toggleMenu(false);
});

popupCloseButtons.forEach((button) => button.addEventListener("click", closePopup));

if (popupBody) popupBody.addEventListener("scroll", updatePopupProgress);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && popup?.classList.contains("is-open")) closePopup();
});

window.addEventListener("scroll", onScroll, { passive: true });

if (menuToggle) menuToggle.addEventListener("click", () => toggleMenu());
