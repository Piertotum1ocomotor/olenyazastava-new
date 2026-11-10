const editionHeader = document.querySelector('.edition-header');
const editionNavigation = editionHeader?.querySelector('.edition-navigation');
const editionMenu = editionHeader?.querySelector('.edition-menu');

if (editionNavigation && editionMenu) {
  function setEditionMenu(open) {
    editionMenu.setAttribute('aria-expanded', String(open));
    editionNavigation.classList.toggle('is-open', open);
  }

  editionHeader.classList.add('is-enhanced');
  editionMenu.addEventListener('click', () => {
    const opening = editionMenu.getAttribute('aria-expanded') !== 'true';
    setEditionMenu(opening);
    if (opening) editionNavigation.querySelector('a')?.focus();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!editionHeader.contains(event.target)) setEditionMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && editionNavigation.classList.contains('is-open')) {
      setEditionMenu(false);
      editionMenu.focus();
    }
  });
  window.matchMedia('(max-width: 1000px)').addEventListener('change', () => {
    setEditionMenu(false);
  });
}

const contactsTab = document.querySelector('.contacts_tabs a[data-toggle=tab][href="#contacts_schema"]');
if (contactsTab && location.hash === contactsTab.hash) {
  document.addEventListener('DOMContentLoaded', () => {
    contactsTab.click();
    document.querySelector('.contacts_tabs').scrollIntoView();
  });
}
