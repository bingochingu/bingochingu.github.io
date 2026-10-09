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
