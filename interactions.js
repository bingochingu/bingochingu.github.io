const revealTargets = document.querySelectorAll("main > section");

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  revealTargets.forEach((target) => target.setAttribute("data-reveal", ""));
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const sectionNavLinks = Array.from(
  document.querySelectorAll('.nav-links a[href^="#"]')
)
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href")),
  }))
  .filter((item) => item.section);

if (sectionNavLinks.length > 0 && "IntersectionObserver" in window) {
  const updateActiveNavLink = () => {
    const activationLine = window.innerHeight * 0.3;
    const current = sectionNavLinks
      .map((item) => ({
        ...item,
        top: item.section.getBoundingClientRect().top,
      }))
      .filter(({ top }) => top <= activationLine)
      .reduce((latest, item) => (!latest || item.top > latest.top ? item : latest), null);
    const firstSectionTop =
      sectionNavLinks[0].section.getBoundingClientRect().top;
    const atPageBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2;
    const active = atPageBottom
      ? sectionNavLinks[sectionNavLinks.length - 1]
      : current || (firstSectionTop > activationLine ? sectionNavLinks[0] : null);

    sectionNavLinks.forEach(({ link, section }) => {
      if (active && section === active.section) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(updateActiveNavLink, {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0,
  });

  sectionNavLinks.forEach(({ section }) => sectionObserver.observe(section));
  let activeNavUpdateRequested = false;
  const requestActiveNavUpdate = () => {
    if (!activeNavUpdateRequested) {
      activeNavUpdateRequested = true;
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        activeNavUpdateRequested = false;
      });
    }
  };

  window.addEventListener("scroll", requestActiveNavUpdate, { passive: true });
  window.addEventListener("resize", requestActiveNavUpdate);
  updateActiveNavLink();
}

const projectTimeline = document.querySelector(".project-timeline");

if (projectTimeline) {
  let progressUpdateRequested = false;

  const updateTimelineProgress = () => {
    const bounds = projectTimeline.getBoundingClientRect();
    const viewportAnchor = window.innerHeight * 0.65;
    const progress = Math.min(
      1,
      Math.max(0, (viewportAnchor - bounds.top) / bounds.height)
    );

    projectTimeline.style.setProperty("--timeline-progress", progress);
    progressUpdateRequested = false;
  };

  const requestTimelineProgressUpdate = () => {
    if (!progressUpdateRequested) {
      progressUpdateRequested = true;
      window.requestAnimationFrame(updateTimelineProgress);
    }
  };

  window.addEventListener("scroll", requestTimelineProgressUpdate, { passive: true });
  window.addEventListener("resize", requestTimelineProgressUpdate);
  updateTimelineProgress();
}
