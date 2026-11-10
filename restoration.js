const root = new URL(document.body.dataset.restorationRoot || 'index.html', location.href);

const header = document.querySelector('.site-header');
const menuToggle = header?.querySelector('.site-menu-toggle');
const navigation = header?.querySelector('.site-nav');
if (menuToggle && navigation) {
  const submenus = [...navigation.querySelectorAll('details')];
  const setMenu = (open) => {
    navigation.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    if (!open) submenus.forEach((menu) => { menu.open = false; });
  };
  header.classList.add('is-enhanced');
  menuToggle.addEventListener('click', () => setMenu(!navigation.classList.contains('is-open')));
  for (const menu of submenus) {
    menu.addEventListener('toggle', () => {
      if (menu.open) submenus.filter((other) => other !== menu).forEach((other) => { other.open = false; });
    });
  }
  document.addEventListener('pointerdown', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const submenu = submenus.find((menu) => menu.open);
    if (submenu) {
      submenu.open = false;
      submenu.querySelector('summary').focus();
    } else if (navigation.classList.contains('is-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

for (const table of document.querySelectorAll('#site-main .content table, #site-main .text table')) {
  if (table.parentElement.closest('.site-table-scroll')) continue;
  const scroll = document.createElement('div');
  scroll.className = 'site-table-scroll';
  scroll.tabIndex = 0;
  scroll.setAttribute('role', 'region');
  scroll.setAttribute('aria-label', table.caption?.textContent.trim() || 'Таблица');
  table.before(scroll);
  scroll.append(table);
}

const booking = document.querySelector('dialog#bookingModal');
const bookingForm = booking?.querySelector('#bookingForm');
if (bookingForm) {
  const required = [...bookingForm.querySelectorAll('input[required]')];
  const submit = bookingForm.querySelector('[type=submit]');
  const title = booking.querySelector('.form-header .title');
  if (title) {
    title.id = 'booking-dialog-title';
    booking.setAttribute('aria-labelledby', title.id);
  }
  const phoneFallback = document.createElement('a');
  phoneFallback.href = 'tel:+73422580505';
  phoneFallback.className = 'site-booking-phone';
  phoneFallback.textContent = 'Позвонить: +7 (342) 258-05-05';
  bookingForm.after(phoneFallback);
  let destination;
  let bookingTrigger;
  booking.addEventListener('close', () => bookingTrigger?.focus());
  bookingForm.addEventListener('change', () => {
    submit.disabled = !required.every((item) => item.checked);
  });
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (destination && required.every((item) => item.checked)) {
      window.open(destination, '_blank', 'noopener,noreferrer');
      booking.close();
    }
  });
  booking.querySelector('.restore-close')?.addEventListener('click', () => booking.close());
  for (const link of document.querySelectorAll('a.bookingBtn')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      destination = link.href;
      bookingTrigger = link;
      bookingForm.reset();
      submit.disabled = true;
      booking.showModal();
    });
  }
}

const images = [...document.querySelectorAll('a[href]')].filter((link) =>
  /\.(avif|gif|jpe?g|png|webp)(?:[?#]|$)/i.test(link.getAttribute('href')) &&
  new URL(link.href).origin === location.origin
);
if (images.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'restore-dialog restore-photo';
  dialog.setAttribute('aria-label', 'Фотография');
  dialog.innerHTML = '<button type="button" class="restore-close" aria-label="Закрыть">×</button><img alt=""><div class="restore-photo-controls"><button type="button" aria-label="Предыдущая фотография">‹</button><button type="button" aria-label="Следующая фотография">›</button></div>';
  document.body.append(dialog);
  const photo = dialog.querySelector('img');
  const [prev, next] = dialog.querySelectorAll('.restore-photo-controls button');
  let index = 0;
  function show(i) {
    index = (i + images.length) % images.length;
    photo.src = images[index].href;
    photo.alt = images[index].querySelector('img')?.alt || images[index].title;
  }
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.querySelector('.restore-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  for (const [i, link] of images.entries()) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  }
}

const results = document.querySelector('#search-results');
if (results) {
  const query = new URLSearchParams(location.search).get('q')?.trim();
  const input = document.querySelector('input[name=q]');
  const status = document.querySelector('#search-status');
  if (query) {
    status.textContent = 'Поиск…';
    input.value = query;
    fetch(new URL('sources.json', root))
      .then((response) => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      })
      .then((pages) => {
        const terms = query.toLocaleLowerCase('ru').split(/\s+/);
        const matching = pages.filter(({ title }) => terms.every((term) => title.toLocaleLowerCase('ru').includes(term)));
        status.textContent = matching.length ? 'Найдено страниц: ' + matching.length : 'Страницы не найдены.';
        for (const page of matching) {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.textContent = page.title;
          link.href = new URL(page.path, root);
          li.append(link);
          results.append(li);
        }
      })
      .catch(() => { status.textContent = 'Поиск доступен при открытии сайта через веб-сервер.'; });
  }
}

for (const tab of document.querySelectorAll('a[data-toggle=tab]')) {
  tab.addEventListener('click', (event) => {
    const panel = document.getElementById(tab.hash.slice(1));
    if (!panel) return;
    event.preventDefault();
    const selected = tab.closest('li');
    selected?.parentElement?.querySelector('.active')?.classList.remove('active');
    selected?.classList.add('active');
    panel.parentElement.querySelector('.tab-pane.active')?.classList.remove('active', 'in');
    panel.classList.add('active', 'in');
  });
}
