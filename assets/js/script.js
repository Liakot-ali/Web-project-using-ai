// ===============================
// BUSINESS WEBSITE MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const orderButtons = document.querySelectorAll(".order-btn");

  orderButtons.forEach((button) => {

    button.addEventListener("click", () => {

      alert(
        "Thank you for your interest!\n\n" +
        "WhatsApp ordering system will be connected here later."
      );

    });

  });

  // Details modal functionality
  const detailsButtons = document.querySelectorAll('.details-btn');
  const productModal = document.getElementById('productModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');

  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const specLength = document.getElementById('specLength');
  const specWidth = document.getElementById('specWidth');
  const specHeight = document.getElementById('specHeight');
  const specBoardDepth = document.getElementById('specBoardDepth');
  const specFrameSize = document.getElementById('specFrameSize');
  const specMaterial = document.getElementById('specMaterial');
  const specWeight = document.getElementById('specWeight');
  const specColor = document.getElementById('specColor');

  function openModalFromCard(card) {
    const titleEl = card.querySelector('.product-content h3');
    const descEl = card.querySelector('.product-content p');

    modalTitle.textContent = titleEl ? titleEl.textContent : 'Product Details';
    modalDescription.textContent = descEl ? descEl.textContent.trim() : '';

    const ds = card.dataset;
    specLength.textContent = ds.length || '—';
    specWidth.textContent = ds.width || '—';
    specHeight.textContent = ds.height || '—';
    specBoardDepth.textContent = ds.boardDepth || '—';
    specFrameSize.textContent = ds.frameSize || '—';
    specMaterial.textContent = ds.material || '—';
    specWeight.textContent = ds.weight || '—';
    specColor.textContent = ds.color || '—';

    productModal.setAttribute('aria-hidden', 'false');
    // trap focus could be added later
  }

  function closeModal() {
    productModal.setAttribute('aria-hidden', 'true');
  }

  detailsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (!card) return;
      openModalFromCard(card);
    });
  });

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================
  // Contact form -> WhatsApp
  // ==========================
  const CONTACT_WHATSAPP_NUMBER = '8801XXXXXXXXX'; // international format without +

  function openWhatsAppWithMessage(number, text) {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${number}?text=${encoded}`;
    window.open(url, '_blank');
  }

  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const waPrimary = document.getElementById('waPrimary');
  const waDirect = document.getElementById('waDirect');
  const emailFallback = document.getElementById('emailFallback');

  if (waPrimary) {
    waPrimary.addEventListener('click', (e) => {
      e.preventDefault();
      // focus the form for quick fill
      const n = document.getElementById('cName');
      if (n) n.focus();
    });
  }

  if (waDirect) {
    waDirect.addEventListener('click', (e) => {
      e.preventDefault();
      const txt = `Hello Liton Desk Studio! I'm reaching out via your website.`;
      openWhatsAppWithMessage(CONTACT_WHATSAPP_NUMBER, txt);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactStatus.textContent = '';

      const name = (document.getElementById('cName') || {}).value || '';
      const phone = (document.getElementById('cPhone') || {}).value || '';
      const email = (document.getElementById('cEmail') || {}).value || '';
      const message = (document.getElementById('cMessage') || {}).value || '';

      if (!name.trim() || !message.trim()) {
        contactStatus.textContent = 'Please add your name and a short message.';
        return;
      }

      const payload = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
      contactStatus.textContent = 'Opening WhatsApp…';
      setTimeout(() => {
        openWhatsAppWithMessage(CONTACT_WHATSAPP_NUMBER, payload);
        contactStatus.textContent = '';
      }, 250);
    });
  }

  if (emailFallback) {
    emailFallback.addEventListener('click', () => {
      const name = (document.getElementById('cName') || {}).value || '';
      const email = (document.getElementById('cEmail') || {}).value || '';
      const message = (document.getElementById('cMessage') || {}).value || '';
      const subject = encodeURIComponent(`Contact from website: ${name || 'Visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:yourmail@gmail.com?subject=${subject}&body=${body}`;
    });
  }

});
