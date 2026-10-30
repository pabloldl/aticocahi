"use strict";

const photos = [...document.querySelectorAll('[data-photo]')];
const dialog = document.querySelector('.lightbox');
const largeImage = dialog.querySelector('.lightbox-image');
let current = 0;
let opener;
function displayPhoto(index) {
  current = (index + photos.length) % photos.length;
  const source = photos[current].querySelector('img');
  largeImage.src = photos[current].dataset.photo;
  largeImage.alt = source.alt;
  dialog.querySelector('.lightbox-caption').textContent = source.alt;
  dialog.querySelector('.photo-counter').textContent = `${current + 1} / ${photos.length}`;
}
photos.forEach((button, index) => button.addEventListener('click', () => {
  opener = button;
  displayPhoto(index);
  dialog.showModal();
  document.body.classList.add('gallery-open');
}));
dialog.querySelector('.close-gallery').addEventListener('click', () => dialog.close());
dialog.querySelector('.previous-photo').addEventListener('click', () => displayPhoto(current - 1));
dialog.querySelector('.next-photo').addEventListener('click', () => displayPhoto(current + 1));
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    displayPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('gallery-open');
  opener?.focus({ preventScroll: true });
});
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
let touchStart;
largeImage.addEventListener('touchstart', (event) => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
largeImage.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) displayPhoto(current + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  document.documentElement.classList.add("js-motion");
}
