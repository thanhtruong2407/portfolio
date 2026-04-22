if (!window.portfolioContent) {
  console.error("Portfolio content not loaded. Ensure content.js is included before project.js.");
}

if (!window.portfolioProjectData) {
  console.error("Project helpers not loaded. Ensure project-data.js is included before project.js.");
}

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const projectHero = document.querySelector("[data-project-hero]");
const projectTitleBar = document.querySelector("[data-project-title-bar]");
const projectTitleBarText = document.querySelector("[data-project-title-bar-text]");

const breadcrumbRoot = document.querySelector("[data-project-breadcrumb]");
const tagsRoot = document.querySelector("[data-project-tags]");
const titleRoot = document.querySelector("[data-project-title]");
const roleRoot = document.querySelector("[data-project-role]");
const summaryRoot = document.querySelector("[data-project-summary]");
const metaRoot = document.querySelector("[data-project-meta]");
const mediaRoot = document.querySelector("[data-project-media]");
const detailSectionsRoot = document.querySelector("[data-project-detail-sections]");
const outcomesLabelRoot = document.querySelector("[data-project-outcomes-label]");
const outcomesRoot = document.querySelector("[data-project-outcomes]");
const foundRoot = document.querySelector("[data-project-found]");
const notFoundRoot = document.querySelector("[data-project-not-found]");

const { getProjectById, getProjectSections } = window.portfolioProjectData || {};

const MOON = "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z";
const SUN = "M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zM3 11H2a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm14.66-5.07.71-.71a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41-1.41zM5.63 17.66l-.71.71a1 1 0 0 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 1.41zm11.32 1.41-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1-1.41 1.41zM5.63 6.34 4.92 5.63a1 1 0 0 1 1.41-1.41l.71.71A1 1 0 0 1 5.63 6.34z";
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
    .map((tag) => {
      const className = tag.accent
        ? "inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200"
        : "inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
      return `<span class="${className}">${escapeHtml(tag.label)}</span>`;
    })
    .join("");
}

function createMetaCard(item) {
  return `
    <div class="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/80">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.label)}</p>
      <p class="mt-2 text-base font-medium text-slate-950 dark:text-white">${escapeHtml(item.value)}</p>
    </div>
  `;
}

function createHeroMedia(project) {
  if (project.heroImageSrc) {
    return `
      <figure class="h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <img
          class="block h-full w-full object-cover"
          src="${escapeHtml(project.heroImageSrc)}"
          alt="${escapeHtml(project.heroImageAlt || project.title)}"
          loading="eager"
        >
      </figure>
    `;
  }

  return `
    <div class="flex aspect-[5/4] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-brand-100 via-white to-slate-100 text-4xl font-bold tracking-[-0.04em] text-brand-300 dark:border-slate-800 dark:from-brand-500/15 dark:via-slate-900 dark:to-slate-900 dark:text-brand-500/40" aria-hidden="true">
      <span>${escapeHtml(project.thumb)}</span>
    </div>
  `;
}

function createInfoCard(card) {
  return `
    <article class="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(card.label)}</p>
      <p class="text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(card.body)}</p>
    </article>
  `;
}

function createBulletList(items = []) {
  if (!Array.isArray(items) || !items.length) return "";
  return `
    <ul class="grid gap-3">
      ${items.map((item) => `<li class="relative pl-5 text-sm leading-7 text-slate-600 before:absolute before:left-0 before:top-3 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-500 dark:text-slate-300">${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function createStepCard(step, index) {
  return `
    <article class="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 sm:grid sm:grid-cols-[64px_minmax(0,1fr)]">
      <div class="flex items-center justify-center border-b border-slate-200 bg-brand-50 px-4 py-4 text-lg font-bold tracking-[-0.03em] text-brand-700 dark:border-slate-800 dark:bg-brand-500/10 dark:text-brand-200 sm:border-b-0 sm:border-r">${String(index + 1).padStart(2, "0")}</div>
      <div class="p-6">
        <h3 class="text-base font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(step.title)}</h3>
        <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(step.text)}</p>
      </div>
    </article>
  `;
}

function createOutcomeCard(item) {
  return `
    <article class="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <p class="text-4xl font-bold tracking-[-0.04em] text-brand-600 dark:text-brand-300">${escapeHtml(item.value)}</p>
      <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.label)}</p>
    </article>
  `;
}

function createRichSection(section, index) {
  const body = Array.isArray(section.body) ? section.body : section.body ? [section.body] : [];
  const cards = Array.isArray(section.cards) ? section.cards : [];
  const bullets = Array.isArray(section.bullets) ? section.bullets : [];
  const steps = Array.isArray(section.steps) ? section.steps : [];
  const badge = section.badge
    ? `<p class="mb-6 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">${escapeHtml(section.badge)}</p>`
    : "";

  return `
    <section class="border-t border-slate-200 px-4 py-12 dark:border-slate-800 sm:px-6 lg:px-8">
      <div class="mx-auto w-full max-w-7xl">
        <div class="mb-7 flex gap-4">
          <p class="min-w-10 text-3xl font-bold tracking-[-0.04em] text-slate-300 dark:text-slate-700">${String(index + 1).padStart(2, "0")}</p>
          <div>
            ${section.label ? `<p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">${escapeHtml(section.label)}</p>` : ""}
            <h2 class="text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(section.title || "")}</h2>
          </div>
        </div>
        ${badge}
        ${body.map((paragraph) => `<p class="mb-5 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300">${escapeHtml(paragraph)}</p>`).join("")}
        ${cards.length ? `<div class="grid gap-5 lg:grid-cols-2">${cards.map(createInfoCard).join("")}</div>` : ""}
        ${bullets.length ? `<div class="mt-1">${createBulletList(bullets)}</div>` : ""}
        ${steps.length ? `<div class="grid gap-4">${steps.map(createStepCard).join("")}</div>` : ""}
      </div>
    </section>
  `;
}

function createLiteSections(project) {
  const tags = (project.tags || []).map((tag) => tag.label).join(" / ");
  const sections = [
    {
      label: "Overview",
      title: "Project summary",
      body: [project.overview || project.description || project.summary],
      cards: project.overviewCards || [],
    },
    {
      label: "Focus",
      title: "What this supporting project demonstrates",
      body: [
        `This supporting project expands the portfolio beyond featured case studies and reinforces Thanh's product-oriented thinking through practical system and workflow work.`,
        tags ? `Primary themes: ${tags}.` : ""
      ].filter(Boolean),
      steps: project.steps || [],
    }
  ];

  return sections.map(createRichSection).join("");
}

function renderNotFound() {
  if (projectTitleBar) {
    projectTitleBar.classList.add("pointer-events-none", "opacity-0", "-translate-y-2");
    projectTitleBar.setAttribute("aria-hidden", "true");
  }
  if (foundRoot) foundRoot.hidden = true;
  if (notFoundRoot) notFoundRoot.hidden = false;
}

function renderFound(project) {
  const metaCards = [
    { label: "Timeline", value: project.timeline },
    { label: "Company", value: project.company },
    { label: "Duration", value: project.duration },
  ].filter((item) => item.value);

  document.title = `${project.title} | Truong H. Viet Thanh`;
  if (breadcrumbRoot) breadcrumbRoot.textContent = project.navIndex || "Project detail";
  if (tagsRoot) tagsRoot.innerHTML = renderTagList(project.tags || []);
  if (titleRoot) titleRoot.textContent = project.title;
  if (projectTitleBarText) projectTitleBarText.textContent = project.title;
  if (roleRoot) roleRoot.textContent = `${project.role} → ${project.roleDetail}`;
  if (summaryRoot) summaryRoot.textContent = project.description || project.summary;
  if (metaRoot) metaRoot.innerHTML = metaCards.map(createMetaCard).join("");
  if (mediaRoot) mediaRoot.innerHTML = createHeroMedia(project);

  if (detailSectionsRoot) {
    detailSectionsRoot.innerHTML = project.detailLevel === "lite"
      ? createLiteSections(project)
      : getProjectSections(project).map(createRichSection).join("");
  }
  if (outcomesLabelRoot) outcomesLabelRoot.textContent = project.outcomesLabel || "Outcomes";
  if (outcomesRoot) outcomesRoot.innerHTML = (project.outcomes || []).map(createOutcomeCard).join("");

  if (foundRoot) foundRoot.hidden = false;
  if (notFoundRoot) notFoundRoot.hidden = true;
}

function setStickyTitleVisibility(isVisible) {
  if (!projectTitleBar) return;
  projectTitleBar.classList.toggle("pointer-events-none", !isVisible);
  projectTitleBar.classList.toggle("opacity-0", !isVisible);
  projectTitleBar.classList.toggle("-translate-y-2", !isVisible);
  projectTitleBar.classList.toggle("opacity-100", isVisible);
  projectTitleBar.classList.toggle("translate-y-0", isVisible);
  projectTitleBar.setAttribute("aria-hidden", String(!isVisible));
}

function setupStickyTitle(project) {
  if (!projectTitleBar || !projectHero || !project) return;

  setStickyTitleVisibility(false);

  const observer = new IntersectionObserver(
    ([entry]) => {
      setStickyTitleVisibility(!entry.isIntersecting);
    },
    {
      rootMargin: "-76px 0px 0px 0px",
      threshold: 0.15,
    }
  );

  observer.observe(projectHero);
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

function initPage() {
  applyTheme("light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const project = typeof getProjectById === "function" ? getProjectById(projectId) : null;

  if (!project) {
    renderNotFound();
  } else {
    renderFound(project);
    setupStickyTitle(project);
  }

  toggleScrolledNav();
  window.addEventListener("scroll", toggleScrolledNav, { passive: true });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-link")) toggleMenu(false);
  });

  if (menuToggle) menuToggle.addEventListener("click", () => toggleMenu());
}

initPage();
