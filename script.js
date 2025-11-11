
// script.js - Shared JS for GoTravel (refined with login redirect)

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const menuBtn = document.querySelector('.menu-icon-btn');
  if (toggle && menuBtn) {
    const setExpanded = () => menuBtn.setAttribute('aria-expanded', String(toggle.checked));
    toggle.addEventListener('change', setExpanded);
    setExpanded();
  }

  const scroller = document.getElementById('destination-scroller');
  const left = document.getElementById('scroll-left');
  const right = document.getElementById('scroll-right');
  const distance = 260;
  if (scroller && left && right) {
    left.addEventListener('click', () => scroller.scrollBy({left:-distance, behavior:'smooth'}));
    right.addEventListener('click', () => scroller.scrollBy({left: distance, behavior:'smooth'}));
  }

  const searchForm = document.querySelector('form.search-bar');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchForm.querySelector('input[type="search"]')?.value?.trim() || '';
      if (!q) return;
      showModal("Search", `You searched for: ${q}\n(This is a demo search bar.)`);
    });
  }

  // ----- Login validation (index.html) with redirect -----
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email');
      const pass = document.getElementById('password');
      clearErrors(loginForm);
      let ok = true;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        markError(email, "Please enter a valid email address.");
        ok = false;
      }
      if ((pass.value||"").length < 6) {
        markError(pass, "Password must be at least 6 characters.");
        ok = false;
      }
      if (!ok) return;
      showModal("Login Successful", `Welcome to GoTravel!\nRedirecting to Home...`);
      setTimeout(() => { window.location.href = "home.html"; }, 2000);
      loginForm.reset();
    });
  }

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(bookingForm);
      const destination = document.getElementById('destination');
      const date = document.getElementById('date');
      const travellers = document.getElementById('travellers');
      const email = document.getElementById('email');

      let valid = true;
      if (!destination.value) { markError(destination, "Please select a destination."); valid = false; }
      if (!date.value) { markError(date, "Please select a departure date."); valid = false; }
      if (!travellers.value || Number(travellers.value) < 1) { markError(travellers, "Minimum 1 traveller."); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { markError(email, "Enter a valid email address."); valid = false; }
      if (!valid) return;

      const msg = [
        "✅ Booking Confirmed!",
        `Destination: ${destination.options[destination.selectedIndex].text}`,
        `Date: ${date.value}`,
        `Travellers: ${travellers.value}`,
        `Email: ${email.value}`,
        "",
        "A confirmation email will be sent shortly. Thanks for choosing GoTravel!"
      ].join("\n");
      showModal("Booking Confirmation", msg);
      bookingForm.reset();
    });
  }

  function showModal(title, content){
    const overlay = document.querySelector('.modal-overlay');
    const modal = document.querySelector('.modal');
    if (!overlay || !modal) { alert(content); return; }
    modal.querySelector('header').textContent = title;
    modal.querySelector('.content').textContent = content;
    overlay.style.display = 'block';
    modal.style.display = 'block';
  }
  function hideModal(){
    const overlay = document.querySelector('.modal-overlay');
    const modal = document.querySelector('.modal');
    if (overlay) overlay.style.display = 'none';
    if (modal) modal.style.display = 'none';
  }
  document.querySelectorAll('.modal-overlay, .modal .actions .btn').forEach(el => {
    el?.addEventListener('click', hideModal);
  });

  function markError(input, msg){
    input.classList.add('input-error');
    let hint = input.parentElement.querySelector('.error-text');
    if (!hint){
      hint = document.createElement('div');
      hint.className = 'error-text';
      input.parentElement.appendChild(hint);
    }
    hint.textContent = msg;
  }
  function clearErrors(form){
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.error-text').forEach(el => el.remove());
  }
});
