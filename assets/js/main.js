(() => {
  'use strict';
  const config = window.ALCANZA_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const email = String(config.businessEmail || '').trim();
  const phone = String(config.businessPhone || '').trim();
  const phoneDigits = phone.replace(/\D/g, '');
  const whatsapp = String(config.whatsappNumber || '').replace(/\D/g, '');
  const endpoint = String(config.formspreeEndpoint || '').trim();
  const responseTime = String(config.responseTime || 'We reply within 24 hours.').trim();

  const setText = (sel, value) => { const el = $(sel); if (el && value) el.textContent = value; };
  const remove = (sel) => { const el = $(sel); if (el) el.remove(); };
  const telHref = (value) => 'tel:' + value.replace(/[^\d+]/g, '');

  // Navigation
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

  // Year
  $$('.js-year').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // Email links and visible addresses
  $$('.js-email-link').forEach(el => {
    if (!email) return;
    el.href = 'mailto:' + email;
    if (el.hasAttribute('data-show-email')) el.textContent = email;
  });
  $$('.js-department-emails').forEach(el => {
    const departments = [
      ['Sales', email],
      ['General', config.infoEmail],
      ['Sourcing', config.sourcingEmail],
      ['Logistics', config.logisticsEmail],
      ['Accounts', config.accountsEmail]
    ].filter(([, value]) => value);
    if (!departments.length) { el.remove(); return; }
    el.innerHTML = departments.map(([label, value]) =>
      `<a class="dept-card" href="mailto:${encodeURIComponent(value)}"><strong>${label}</strong><span>${value}</span></a>`
    ).join('');
  });

  // Phone links
  $$('.js-phone-link, [data-phone]').forEach(el => {
    if (!phone) { el.remove(); return; }
    el.href = telHref(phone);
    el.textContent = phone;
  });

  // WhatsApp links
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

  // Company / legal / social details
  $$('.js-company-address').forEach(el => {
    if (config.companyAddress) el.textContent = config.companyAddress;
    else el.remove();
  });
  $$('.js-legal-entity').forEach(el => {
    const legal = String(config.legalName || '').trim();
    const reg = String(config.registrationNumber || '').trim();
    if (!legal && !reg) { el.remove(); return; }
    el.textContent = [legal, reg && `Reg. ${reg}`].filter(Boolean).join(' · ');
  });
  $$('.js-social-links').forEach(el => {
    const url = String(config.linkedinUrl || '').trim();
    if (!/^https:\/\/(www\.)?linkedin\.com\//.test(url)) { el.remove(); return; }
    el.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>`;
  });
  $$('.js-founded-line').forEach(el => {
    const year = String(config.foundedYear || '').trim();
    if (!/^\d{4}$/.test(year)) { el.remove(); return; }
    el.textContent = ` Established in ${year}, `;
  });
  $$('.js-about-fact').forEach(el => {
    const year = String(config.foundedYear || '').trim();
    const address = String(config.companyAddress || '').trim();
    if (!/^\d{4}$/.test(year) && !address) { el.remove(); return; }
    el.textContent = [
      /^\d{4}$/.test(year) ? `Established in ${year}` : '',
      address ? `based in ${address}` : ''
    ].filter(Boolean).join(' and ') + '.';
  });

  // Credentials, team and proof blocks are hidden until real data is configured.
  $$('[data-credentials]').forEach(el => {
    const items = Array.isArray(config.certifications) ? config.certifications : [];
    if (!items.length) { el.remove(); return; }
    el.innerHTML = items.map(item =>
      `<div class="credential-item"><strong>${item.name || 'Registration'}</strong><span>${item.number || ''}</span><small>${item.detail || ''}</small></div>`
    ).join('');
  });
  $$('[data-team]').forEach(el => {
    const items = Array.isArray(config.team) ? config.team : [];
    if (!items.length) { el.closest('section')?.remove(); return; }
    el.innerHTML = items.map(person =>
      `<article class="team-card">${person.photo ? `<img src="${person.photo}" alt="${person.name || 'Team member'}" loading="lazy">` : ''}<div><h3>${person.name || 'Team member'}</h3><p>${person.role || ''}</p>${person.linkedin ? `<a href="${person.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>` : ''}</div></article>`
    ).join('');
  });
  $$('[data-proof]').forEach(el => {
    const items = Array.isArray(config.caseStudies) ? config.caseStudies : [];
    if (!items.length) { el.closest('section')?.remove(); return; }
    el.innerHTML = items.map(item =>
      `<article class="info-card"><h3>${item.title || ''}</h3><p>${item.text || ''}</p></article>`
    ).join('');
  });

  // Response promise
  $$('.js-response-promise').forEach(el => { el.textContent = responseTime; });

  // Optional analytics
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

  // Product search and category filters
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

  // Enquiry forms
  const form = $('[data-enquiry-form]');
  if (form) {
    const status = $('#form-status');
    const send = $('button[type="submit"]', form);
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
          setStatus(`Thank you. Your enquiry has been sent to Alcanza Global. ${responseTime}`);
        } catch (err) {
          setStatus('Your enquiry could not be sent. Please try again or email us directly.', true);
        } finally {
          send.disabled = false;
          send.textContent = 'Send enquiry';
        }
      } else if (email) {
        const subject = encodeURIComponent('New B2B enquiry — Alcanza Global');
        const body = encodeURIComponent(summary());
        const link = `mailto:${email}?subject=${subject}&body=${body}`;
        setStatus(`Your email application should open with your enquiry. Press Send there to complete your request. ${responseTime}`);
        window.location.href = link;
      } else {
        setStatus('Online submission is not active yet. Please email Alcanza Global directly.', true);
      }
    });
  }
})();
