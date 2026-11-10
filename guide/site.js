const menu = document.querySelector('.mobile-menu');

if (menu) {
  const menuButton = menu.querySelector('summary');

  menu.querySelector('nav').addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    menu.open = false;
    if (!link.hash || link.pathname !== window.location.pathname) return;

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
}

const photoDialog = document.querySelector('.photo-dialog');

if (typeof photoDialog?.showModal === 'function') {
  const figure = photoDialog.querySelector('figure');
  const dialogImage = figure.querySelector('img');
  const dialogCaption = figure.querySelector('figcaption');
  const controls = document.createElement('div');
  controls.className = 'photo-controls';
  controls.hidden = true;
  controls.innerHTML = '<button type="button">Предыдущее</button><span aria-live="polite"></span><button type="button">Следующее</button>';
  figure.append(controls);

  const [previous, counter, next] = controls.children;
  let trigger;
  let photos = [];
  let index = 0;

  function galleryName(link) {
    return link.closest('[data-gallery]')?.dataset.gallery;
  }

  function showPhoto() {
    const photo = photos[index];
    const thumbnail = photo.querySelector('img');
    dialogImage.src = photo.href;
    dialogImage.alt = thumbnail?.alt ?? '';
    dialogCaption.textContent = photo.dataset.caption || dialogImage.alt || 'Фотография курорта';
    counter.textContent = `${index + 1} из ${photos.length}`;
  }

  function move(step) {
    index = (index + step + photos.length) % photos.length;
    showPhoto();
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.gallery-image[href]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    trigger = link;
    const group = galleryName(link);
    photos = group
      ? [...document.querySelectorAll('a.gallery-image[href]')].filter((photo) => galleryName(photo) === group)
      : [link];
    index = photos.indexOf(link);
    controls.hidden = photos.length === 1;
    photoDialog.toggleAttribute('data-grouped', photos.length > 1);
    showPhoto();
    photoDialog.showModal();
  });

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  photoDialog.addEventListener('keydown', (event) => {
    if (photos.length < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;

    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });

  photoDialog.querySelector('.dialog-close').addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });
  photoDialog.addEventListener('close', () => trigger?.focus());
}
