export function openModal(modalId) {
  let modal = document.getElementById(modalId);
  modal.classList.add('show');
  modal.style.display = 'block';
  document.body.classList.add('modal-open'); // This class ensures scroll is disabled on the main body

  // Add backdrop
  let div = document.createElement('div');
  div.className = 'modal-backdrop fade show';
  document.body.appendChild(div);
}

export function closeModal(modalId) {
  let modal = document.getElementById(modalId);
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');

  // Remove backdrop
  let backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    document.body.removeChild(backdrop);
  }
}
