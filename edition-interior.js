const sectionNavigation = document.querySelector('.edition-section-nav');
if (sectionNavigation) {
  const compactLayout = window.matchMedia('(max-width: 900px)');

  function syncSectionNavigation({ matches }) {
    sectionNavigation.open = !matches;
  }

  syncSectionNavigation(compactLayout);
  compactLayout.addEventListener('change', syncSectionNavigation);
}
