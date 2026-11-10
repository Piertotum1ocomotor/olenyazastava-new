const menu = document.querySelector('.mobile-menu');
const menuButton = menu.querySelector('summary');

menu.querySelector('nav').addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  menu.open = false;
  const destination = document.getElementById(link.hash.slice(1));
  if (destination) {
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  }
});

menu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menuButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (menu.open && !menu.contains(event.target)) menu.open = false;
});

const photoDialog = document.querySelector('.photo-dialog');

if (typeof photoDialog.showModal === 'function') {
  const dialogImage = photoDialog.querySelector('img');
  const dialogCaption = photoDialog.querySelector('figcaption');
  let trigger;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('.gallery-image');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    trigger = link;
    dialogImage.src = link.href;
    dialogImage.alt = link.querySelector('img').alt;
    dialogCaption.textContent = link.dataset.caption;
    photoDialog.showModal();
  });

  photoDialog.querySelector('button').addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });
  photoDialog.addEventListener('close', () => trigger?.focus());
}
