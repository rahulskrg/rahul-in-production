const header = document.querySelector(".site-header");
const progressBar = header.querySelector(".page-progress");
const career = document.querySelector(".career");
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navItems = Array.from(header.querySelectorAll('a[href^="#"]:not([href="#top"])'), link => ({
  link,
  section: document.getElementById(link.hash.slice(1)),
}));

const clamp = value => Math.max(0, Math.min(1, value));

let activeLink;
let frame = 0;
let careerProgress;

function updateScrollState() {
  frame = 0;
  const remaining = document.documentElement.scrollHeight - window.innerHeight;
  const atEnd = remaining > 0 && window.scrollY >= remaining - 1;

  if (!motion.matches) {
    const { top, height } = career.getBoundingClientRect();
    const nextProgress = height ? clamp((window.innerHeight * 0.66 - top) / height) : 1;
    if (nextProgress !== careerProgress) {
      career.style.setProperty("--career-progress", nextProgress);
      careerProgress = nextProgress;
    }
    progressBar.style.setProperty("--page-progress", remaining > 0 ? clamp(window.scrollY / remaining) : 0);
  }

  const readingLine = header.offsetHeight + Math.min(window.innerHeight * 0.2, 144);
  const current = atEnd ? navItems.at(-1) : navItems.findLast(({ section }) =>
    section.getBoundingClientRect().top <= readingLine,
  );
  if (current?.link === activeLink) return;
  activeLink?.removeAttribute("aria-current");
  activeLink = current?.link;
  activeLink?.setAttribute("aria-current", "location");
}

function requestScrollUpdate() {
  if (!frame) frame = window.requestAnimationFrame(updateScrollState);
}

function updateHeaderOffset() {
  document.documentElement.style.setProperty("--header-offset", `${header.offsetHeight}px`);
  requestScrollUpdate();
}

function openProjectFromHash(behavior = "auto") {
  const project = document.getElementById(window.location.hash.slice(1));
  if (!project?.matches(".projects details")) return;
  project.open = true;
  project.querySelector("summary").focus({ preventScroll: true });
  project.scrollIntoView({ block: "start", behavior });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", updateHeaderOffset);
motion.addEventListener("change", requestScrollUpdate);
new ResizeObserver(updateHeaderOffset).observe(header);
new ResizeObserver(requestScrollUpdate).observe(document.querySelector("main"));

window.addEventListener("hashchange", () => openProjectFromHash());
document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#project-"]');
  if (!link || link.hash !== window.location.hash || event.defaultPrevented ||
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const project = document.getElementById(link.hash.slice(1));
  if (!project?.matches(".projects details")) return;
  event.preventDefault();
  openProjectFromHash();
});

updateHeaderOffset();
openProjectFromHash("instant");
