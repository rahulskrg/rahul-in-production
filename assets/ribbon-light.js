const browser = document.querySelector(".workbench");

if (browser) {
  const fader = browser.querySelector("#work-selector");
  const preview = browser.querySelector("#project-preview");
  const links = Array.from(browser.querySelectorAll(".workbench-links a"));
  const projects = links.map(link => {
    const project = document.getElementById(link.hash.slice(1));
    return {
      link,
      title: project?.querySelector(".project-name")?.textContent.trim(),
      description: project?.querySelector(".project-summary")?.textContent.trim(),
    };
  });

  if (fader && preview && projects.length > 1 && projects.every(project => project.title && project.description)) {
    const title = preview.querySelector("h3");
    const description = preview.querySelector("p");
    const action = preview.querySelector("a");

    function showProject() {
      const index = fader.valueAsNumber;
      const selected = projects[index];
      if (!selected) return;
      title.textContent = selected.title;
      description.textContent = selected.description;
      action.href = selected.link.hash;
      fader.setAttribute("aria-valuetext", selected.link.textContent.trim());
      fader.style.setProperty("--fader-fill", `${index / (projects.length - 1) * 100}%`);
      for (const { link } of projects) link.toggleAttribute("data-selected", link === selected.link);
    }

    fader.max = String(projects.length - 1);
    fader.addEventListener("input", showProject);
    showProject();
    fader.parentElement.hidden = false;
  }
}

const canvas = document.querySelector(".hero-light");
const context = canvas?.getContext("2d");

if (canvas && context) {
  const hero = canvas.parentElement;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tokens = getComputedStyle(hero);
  const horizon = tokens.getPropertyValue("--color-horizon").trim();
  const amber = tokens.getPropertyValue("--color-accent").trim();
  const duration = 3600;
  let elapsed = 0;
  let lastTime = 0;
  let frame = 0;
  let visible = false;

  function draw(progress) {
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    if (!width || !height) return;

    const gradient = context.createLinearGradient(0, height * 0.7, width, height * 0.7);
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(0.42, horizon);
    gradient.addColorStop(1, "transparent");
    context.strokeStyle = gradient;
    const drift = (1 - progress) ** 3 * height * 0.07;

    // Wide reflections below the project browser leave the reading area still and dark.
    for (let line = 0; line < 14; line++) {
      const position = line / 13;
      const startY = height * (0.79 + position * 0.13) + drift;
      context.globalAlpha = Math.sin(position * Math.PI) * 0.22;
      context.lineWidth = Math.max(1, width / 1250);
      context.beginPath();
      context.moveTo(-width * 0.05, startY);
      context.bezierCurveTo(
        width * 0.32, startY - height * (0.08 - position * 0.07),
        width * 0.74, height * (0.88 + position * 0.08) + drift,
        width * 1.05, height * (0.73 + position * 0.09) + drift,
      );
      context.stroke();
    }

    const reflectedLight = context.createLinearGradient(width * 0.38, 0, width * 0.68, 0);
    reflectedLight.addColorStop(0, "transparent");
    reflectedLight.addColorStop(0.54, amber);
    reflectedLight.addColorStop(1, "transparent");
    context.fillStyle = reflectedLight;
    context.globalAlpha = 0.17 * progress;
    context.fillRect(width * 0.38, height * 0.927, width * 0.3, 1);
    context.globalAlpha = 1;
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(hero.clientWidth * ratio);
    canvas.height = Math.round(hero.clientHeight * ratio);
    draw(motion.matches ? 1 : elapsed / duration);
  }

  function animate(now) {
    frame = 0;
    if (lastTime) elapsed = Math.min(duration, elapsed + now - lastTime);
    lastTime = now;
    draw(elapsed / duration);
    if (elapsed < duration) frame = window.requestAnimationFrame(animate);
  }

  function sync() {
    window.cancelAnimationFrame(frame);
    frame = lastTime = 0;
    if (motion.matches) {
      draw(1);
    } else if (visible && !document.hidden && elapsed < duration) {
      frame = window.requestAnimationFrame(animate);
    }
  }

  canvas.hidden = false;
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }).observe(hero);
  }
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
}
