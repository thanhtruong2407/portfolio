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
const showcaseSectionRoot = document.querySelector("[data-project-showcase-section]");
const showcaseRoot = document.querySelector("[data-project-showcase]");
const detailSectionsRoot = document.querySelector("[data-project-detail-sections]");
const outcomesSectionRoot = document.querySelector("[data-project-outcomes-section]");
const outcomesLabelRoot = document.querySelector("[data-project-outcomes-label]");
const outcomesRoot = document.querySelector("[data-project-outcomes]");
const paginationRoot = document.querySelector("[data-project-pagination]");
const foundRoot = document.querySelector("[data-project-found]");
const notFoundRoot = document.querySelector("[data-project-not-found]");

const { getProjectById, getProjectSections, getAdjacentProjects } = window.portfolioProjectData || {};

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

function createProjectShowcase(project) {
  if (project.showcaseImageSrc) {
    return `
      <figure class="overflow-hidden rounded-[2rem]">
        <img
          class="block w-full object-cover"
          src="${escapeHtml(project.showcaseImageSrc)}"
          alt="${escapeHtml(project.showcaseImageAlt || project.title)}"
          loading="eager"
        >
      </figure>
    `;
  }

  return "";
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

function createSectionColumn(column) {
  const bullets = Array.isArray(column?.bullets) ? column.bullets : [];
  return `
    <div class="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">${escapeHtml(column.title || "")}</h3>
      ${column.body ? `<p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">${escapeHtml(column.body)}</p>` : ""}
      ${bullets.length ? `<div class="mt-5">${createBulletList(bullets)}</div>` : ""}
    </div>
  `;
}

function createCarouselSlideImage(slide) {
  if (slide.imageSrc) return slide.imageSrc;

  const palette = slide.palette || ["#6D50F0", "#A78BFA", "#E9D5FF"];
  const title = String(slide.label || "").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" fill="none">
      <rect width="1600" height="900" fill="transparent"/>
      <g opacity="0.18">
        <circle cx="290" cy="220" r="170" fill="${palette[0]}"/>
        <circle cx="1270" cy="230" r="150" fill="${palette[1]}"/>
        <circle cx="1110" cy="660" r="230" fill="${palette[2]}"/>
      </g>
      <g opacity="0.95">
        <rect x="180" y="180" width="1240" height="540" rx="40" fill="white"/>
        <rect x="260" y="270" width="310" height="44" rx="22" fill="${palette[0]}" fill-opacity="0.12"/>
        <rect x="260" y="360" width="520" height="30" rx="15" fill="${palette[1]}" fill-opacity="0.2"/>
        <rect x="260" y="410" width="420" height="30" rx="15" fill="${palette[2]}" fill-opacity="0.18"/>
        <rect x="260" y="500" width="210" height="110" rx="24" fill="${palette[0]}" fill-opacity="0.14"/>
        <rect x="500" y="500" width="210" height="110" rx="24" fill="${palette[1]}" fill-opacity="0.16"/>
        <rect x="740" y="500" width="210" height="110" rx="24" fill="${palette[2]}" fill-opacity="0.18"/>
        <circle cx="1140" cy="455" r="130" fill="${palette[0]}" fill-opacity="0.14"/>
        <circle cx="1140" cy="455" r="82" fill="${palette[1]}" fill-opacity="0.22"/>
      </g>
      <text x="260" y="245" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="46" font-weight="700">${title}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createCarousel(section, index) {
  const slides = Array.isArray(section.carousel?.slides) ? section.carousel.slides : [];
  if (!slides.length) return "";

  const carouselId = `carousel-${index + 1}`;
  const trackWidth = `${slides.length * 100}%`;
  const slideWidth = `${100 / slides.length}%`;
  return `
    <div class="mt-10 rounded-[2rem] bg-white px-4 py-6 shadow-card dark:bg-slate-900 sm:px-6 lg:px-8" data-carousel id="${carouselId}" tabindex="0" aria-roledescription="carousel" aria-label="${escapeHtml(section.carousel?.title || section.title || "Section carousel")}">
      <div class="relative">
        <button class="absolute left-0 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300" type="button" data-carousel-prev aria-label="Previous slide">
          <span aria-hidden="true">←</span>
        </button>
        <button class="absolute right-0 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300" type="button" data-carousel-next aria-label="Next slide">
          <span aria-hidden="true">→</span>
        </button>
        <div class="overflow-hidden px-14 sm:px-16">
          <div class="flex transition-transform duration-300 ease-out will-change-transform" data-carousel-track style="width: ${trackWidth};">
            ${slides.map((slide, slideIndex) => `
              <article class="shrink-0" style="width: ${slideWidth};" data-carousel-slide aria-roledescription="slide" aria-label="${escapeHtml(`${slideIndex + 1} of ${slides.length}`)}">
                <div class="px-3 sm:px-4">
                  ${slide.description ? `
                    <div class="mb-5">
                      <h3 class="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">${escapeHtml(slide.label || "")}</h3>
                      <p class="mt-3 max-w-3xl overflow-hidden text-ellipsis whitespace-nowrap text-base leading-8 text-slate-600 dark:text-slate-300">${escapeHtml(slide.description)}</p>
                    </div>
                  ` : ""}
                  <img class="block w-full" src="${escapeHtml(createCarouselSlideImage(slide))}" alt="${escapeHtml(slide.label || "")}" draggable="false">
                </div>
              </article>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-2" data-carousel-dots>
        ${slides.map((slide, slideIndex) => `
          <button class="h-2.5 w-2.5 rounded-full bg-slate-300 transition hover:bg-brand-400 dark:bg-slate-700 dark:hover:bg-brand-400" type="button" data-carousel-dot data-slide-index="${slideIndex}" aria-label="${escapeHtml(`Go to ${slide.label || `slide ${slideIndex + 1}`}`)}"></button>
        `).join("")}
      </div>
    </div>
  `;
}

function createSectionImage(section) {
  if (!section.imageSrc) return "";
  return `
    <figure class="mt-10 overflow-hidden rounded-[2rem]">
      <img
        class="block w-full"
        src="${escapeHtml(section.imageSrc)}"
        alt="${escapeHtml(section.imageAlt || section.title || "")}"
        loading="lazy"
      >
    </figure>
  `;
}

function createStatCard(item) {
  return `
    <article class="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70">
      <p class="text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">${escapeHtml(item.value)}</p>
      <p class="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">${escapeHtml(item.label)}</p>
      ${item.detail ? `<p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">${escapeHtml(item.detail)}</p>` : ""}
    </article>
  `;
}

function createProjectNavCard(project, direction) {
  const label = direction === "previous" ? "Previous" : "Next";
  const arrow = direction === "previous" ? "←" : "→";
  const alignClass = direction === "previous" ? "items-start text-left" : "items-start text-left md:items-end md:text-right";

  if (!project) {
    return `
      <div class="min-h-[88px] rounded-[1.25rem] border border-dashed border-slate-200/80 dark:border-slate-800"></div>
    `;
  }

  return `
    <a class="group flex min-h-[88px] flex-col justify-center rounded-[1.25rem] border border-slate-200 bg-white px-5 py-4 transition duration-200 hover:border-brand-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40 dark:hover:bg-slate-900 ${alignClass}" href="./project.html?id=${encodeURIComponent(project.id)}">
      <div class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        <span>${direction === "previous" ? arrow : ""}</span>
        <span>${label}</span>
        <span>${direction === "next" ? arrow : ""}</span>
      </div>
      <h3 class="mt-3 text-lg font-semibold leading-tight tracking-[-0.02em] text-slate-950 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">${escapeHtml(project.title)}</h3>
    </a>
  `;
}

function createRichSection(section, index) {
  const body = Array.isArray(section.body) ? section.body : section.body ? [section.body] : [];
  const cards = Array.isArray(section.cards) ? section.cards : [];
  const bullets = Array.isArray(section.bullets) ? section.bullets : [];
  const steps = Array.isArray(section.steps) ? section.steps : [];
  const stats = Array.isArray(section.stats) ? section.stats : [];
  const columns = Array.isArray(section.columns) ? section.columns : [];
  const carousel = section.carousel ? createCarousel(section, index) : "";
  const sectionImage = createSectionImage(section);
  const badge = section.badge
    ? `<p class="mb-6 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">${escapeHtml(section.badge)}</p>`
    : "";

  return `
    <section class="border-t border-slate-200 px-4 py-12 dark:border-slate-800 sm:px-6 lg:px-8">
      <div class="mx-auto w-full max-w-7xl">
        <div class="mb-10">
          <p class="text-5xl font-bold tracking-[-0.05em] text-slate-300 dark:text-slate-700">${String(index + 1).padStart(2, "0")}</p>
          <div class="mt-8">
            ${section.label ? `<p class="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">${escapeHtml(section.label)}</p>` : ""}
            <h2 class="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">${escapeHtml(section.title || "")}</h2>
          </div>
        </div>
        ${badge}
        ${body.map((paragraph) => `<p class="mb-5 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300">${escapeHtml(paragraph)}</p>`).join("")}
        ${stats.length ? `<div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">${stats.map(createStatCard).join("")}</div>` : ""}
        ${columns.length ? `<div class="mb-8 grid gap-5 lg:grid-cols-2">${columns.map(createSectionColumn).join("")}</div>` : ""}
        ${cards.length ? `<div class="grid gap-5 lg:grid-cols-2">${cards.map(createInfoCard).join("")}</div>` : ""}
        ${bullets.length ? `<div class="mt-1">${createBulletList(bullets)}</div>` : ""}
        ${steps.length ? `<div class="grid gap-4">${steps.map(createStepCard).join("")}</div>` : ""}
        ${sectionImage}
        ${carousel}
      </div>
    </section>
  `;
}

function initCarousel(root) {
  const track = root.querySelector("[data-carousel-track]");
  const slides = [...root.querySelectorAll("[data-carousel-slide]")];
  const dots = [...root.querySelectorAll("[data-carousel-dot]")];
  const prevButton = root.querySelector("[data-carousel-prev]");
  const nextButton = root.querySelector("[data-carousel-next]");
  if (!track || !slides.length || !prevButton || !nextButton) return;

  let currentIndex = 0;
  let touchStartX = null;
  let touchDeltaX = 0;

  function render() {
    const currentSlide = slides[currentIndex];
    const offset = currentSlide ? currentSlide.offsetLeft : 0;
    track.style.transform = `translateX(-${offset}px)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("bg-brand-500", isActive);
      dot.classList.toggle("dark:bg-brand-400", isActive);
      dot.classList.toggle("bg-slate-300", !isActive);
      dot.classList.toggle("dark:bg-slate-700", !isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    render();
  }

  prevButton.addEventListener("click", () => goTo(currentIndex - 1));
  nextButton.addEventListener("click", () => goTo(currentIndex + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.slideIndex)));
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  });

  root.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
    touchDeltaX = 0;
  }, { passive: true });

  root.addEventListener("touchmove", (event) => {
    if (touchStartX == null) return;
    touchDeltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
  }, { passive: true });

  root.addEventListener("touchend", () => {
    if (touchStartX == null) return;
    if (touchDeltaX > 40) goTo(currentIndex - 1);
    if (touchDeltaX < -40) goTo(currentIndex + 1);
    touchStartX = null;
    touchDeltaX = 0;
  });

  render();
}

function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
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
  if (showcaseSectionRoot) showcaseSectionRoot.hidden = !project.showcaseImageSrc;
  if (showcaseRoot) showcaseRoot.innerHTML = createProjectShowcase(project);

  if (detailSectionsRoot) {
    detailSectionsRoot.innerHTML = project.detailLevel === "lite"
      ? createLiteSections(project)
      : getProjectSections(project).map(createRichSection).join("");
  }
  initCarousels();
  const shouldShowOutcomes = !project.hideOutcomesSummary && Array.isArray(project.outcomes) && project.outcomes.length > 0;
  if (outcomesSectionRoot) outcomesSectionRoot.hidden = !shouldShowOutcomes;
  if (shouldShowOutcomes) {
    if (outcomesLabelRoot) outcomesLabelRoot.textContent = project.outcomesLabel || "Outcomes";
    if (outcomesRoot) outcomesRoot.innerHTML = (project.outcomes || []).map(createOutcomeCard).join("");
  } else if (outcomesRoot) {
    outcomesRoot.innerHTML = "";
  }
  if (paginationRoot && typeof getAdjacentProjects === "function") {
    const { previous, next } = getAdjacentProjects(project.id);
    paginationRoot.innerHTML = [
      createProjectNavCard(previous, "previous"),
      createProjectNavCard(next, "next"),
    ].join("");
  }

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
