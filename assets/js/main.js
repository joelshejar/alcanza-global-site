(() => {
  'use strict';
  const config = window.ALCANZA_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const email = String(config.businessEmail || '').trim();
  const whatsapp = String(config.whatsappNumber || '').replace(/\D/g, '');
  const endpoint = String(config.formspreeEndpoint || '').trim();

  const menu = $('.menu-toggle');
  const nav = $('#primary-navigation');
  if (menu && nav) {
    const close = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const active = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(active));
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape') close(); });
    document.addEventListener('click', ev => { if (!nav.contains(ev.target) && !menu.contains(ev.target)) close(); });
  }
  $$('.js-year').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  $$('.js-email-link').forEach(el => {
    if (email) { el.href = 'mailto:' + email; if (el.hasAttribute('data-show-email')) el.textContent = email; }
    else if (el.hasAttribute('data-show-email')) el.textContent = 'Use our enquiry form';
  });
  $$('.js-company-address').forEach(el => {
    if (config.companyAddress) el.textContent = config.companyAddress;
    else el.remove();
  });
  if (whatsapp.length >= 8 && whatsapp.length <= 15) {
    $$('[data-whatsapp]').forEach(el => {
      const product = el.getAttribute('data-product') || '';
      const msg = product
        ? `Hello Alcanza Global, I am interested in ${product}. Please share specifications, packaging and bulk quotation details.`
        : 'Hello Alcanza Global, I would like to enquire about your products and international sourcing services.';
      el.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
      el.style.display = el.classList.contains('float-whatsapp') ? 'flex' : 'inline-flex';
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  } else {
    $$('[data-whatsapp]').forEach(el => el.remove());
  }

  // Optional analytics; set the measurement ID only after deciding cookie/privacy policy.
  if (/^G-[A-Z0-9]+$/.test(config.googleAnalyticsId || '')) {
    const id = config.googleAnalyticsId;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', id);
  }

  // Search and category filters on /products.html.
  const productGrid = $('[data-product-grid]');
  if (productGrid) {
    const cards = $$('.product-card[data-category]', productGrid);
    const filters = $$('[data-filter]');
    const search = $('#product-search');
    const status = $('#catalog-count');
    const empty = $('#no-results');
    let currentCategory = 'all';
    const update = () => {
      const query = String(search?.value || '').trim().toLowerCase();
      let count = 0;
      cards.forEach(card => {
        const matchesCategory = currentCategory === 'all' || card.dataset.category === currentCategory;
        const matchesQuery = card.textContent.toLowerCase().includes(query);
        const show = matchesCategory && matchesQuery;
        card.hidden = !show;
        card.style.display = show ? '' : 'none';
        if (show) count++;
      });
      if (status) status.textContent = `Showing ${count} of ${cards.length} commodities`;
      if (empty) empty.style.display = count ? 'none' : 'block';
    };
    filters.forEach(button => button.addEventListener('click', () => {
      currentCategory = button.dataset.filter;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update();
    }));
    search?.addEventListener('input', update);
    const qsCategory = new URLSearchParams(window.location.search).get('category');
    if (qsCategory && filters.some(btn => btn.dataset.filter === qsCategory)) {
      filters.find(btn => btn.dataset.filter === qsCategory)?.click();
    }
    update();
  }

  const form = $('[data-enquiry-form]');
  if (form) {
    const status = $('#form-status');
    const send = $('button[type="submit"]', form);
    const copy = $('#copy-enquiry');
    const selectedProduct = new URLSearchParams(location.search).get('product');
    const productSelect = $('[name="product"]', form);
    if (selectedProduct && productSelect) {
      const choice = Array.from(productSelect.options).find(opt => opt.value.toLowerCase() === selectedProduct.toLowerCase());
      if (choice) productSelect.value = choice.value;
    }
    const setStatus = (message, error = false) => {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status show' + (error ? ' error' : '');
      status.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    };
    const summary = () => {
      const data = new FormData(form);
      const fields = [
        ['Full Name', 'fullName'], ['Company', 'company'], ['Email', 'email'],
        ['Phone', 'phone'], ['Country', 'country'], ['Product', 'product'],
        ['Quantity', 'quantity'], ['Packaging', 'packaging'], ['Destination', 'destination'],
        ['Message', 'message']
      ];
      return 'ALCANZA GLOBAL — NEW BUSINESS ENQUIRY\n\n' + fields
        .map(([label, key]) => label + ': ' + (String(data.get(key) || '').trim() || 'Not specified'))
        .join('\n');
    };
    copy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summary());
        setStatus('Your enquiry details were copied. Paste them into your email to contact Alcanza Global.');
      } catch(err) {
        setStatus('Clipboard access is unavailable. Please use your browser’s secure HTTPS address, or select and copy the form information.', true);
      }
    });
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      if (String(new FormData(form).get('website') || '').trim()) return; // honeypot
      if (endpoint) {
        if (!/^https:\/\/formspree\.io\/f\/[\w-]+$/.test(endpoint)) {
          setStatus('The form service is not configured correctly. Please check assets/js/config.js.', true);
          return;
        }
        send.disabled = true;
        send.textContent = 'Sending…';
        try {
          const response = await fetch(endpoint, {
            method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'}
          });
          if (!response.ok) throw new Error('Form submission failed');
          form.reset();
          setStatus('Thank you. Your enquiry has been sent to Alcanza Global.');
        } catch (err) {
          setStatus('Your enquiry could not be sent. Please try again or use the email option.', true);
        } finally {
          send.disabled = false;
          send.textContent = 'Send enquiry ↗';
        }
      } else if (email) {
        const subject = encodeURIComponent('New B2B enquiry — Alcanza Global');
        const body = encodeURIComponent(summary());
        const link = `mailto:${email}?subject=${subject}&body=${body}`;
        setStatus('Your email application should open with your enquiry. Press Send there to complete your request.');
        window.location.href = link;
      } else {
        setStatus('Online submission is not active yet. The site owner must add a business email or Formspree endpoint in assets/js/config.js. You can copy your enquiry using the button below.', true);
      }
    });
  }
})();
