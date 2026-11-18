# Alcanza Global — Static B2B Website

A ready-to-deploy static corporate website for Alcanza Global. Built in **plain HTML, CSS and vanilla JavaScript**; there is **no build step, no package manager and no backend**.

## Included

- Corporate homepage and original SVG-based brand identity.
- About, Services, Global Sourcing, Markets, Quality, Contact, Quote, FAQ, Privacy and Terms pages.
- Searchable, category-filterable catalogue with **11 individual product pages**.
- Responsive desktop, tablet and mobile design.
- Enquiry form with optional **Formspree** delivery, `mailto:` fallback and copy-to-clipboard fallback.
- WhatsApp Business deep links when a number is configured.
- Local original SVG commodity illustrations (no externally hosted stock photos).
- Descriptive metadata and individual Product JSON-LD on product pages.
- A11y basics: keyboard navigation, labels, focus styles, reduced-motion support and a skip link.

## IMPORTANT — do these 4 things before going live

1. **Configure your business contacts:** Edit `assets/js/config.js` and enter `businessEmail` and `whatsappNumber`.
2. **Enable actual form delivery:** Create and verify a form at [Formspree](https://formspree.io/) and paste its endpoint into `formspreeEndpoint` in `assets/js/config.js`. Without an endpoint, the form opens the visitor's email app **only if** `businessEmail` is set; it does **not** send anything automatically. Without either, it displays a clear setup message and offers copy-to-clipboard.
3. **Confirm business content:** Verify all product origins, specifications, availability, approved services, legal information and company registration details. Do not publish third-party supplier photos or certifications without permission.
4. **Approve brand visuals:** The logo, colours and original product illustrations are launch concepts, not supplier product photos. Replace illustrations with approved real commodity photos when available.

## Deploy on GitHub Pages (no build)

1. Download and **extract** the supplied ZIP.
2. Create a new public GitHub repository (for example `alcanza-global`).
3. Upload **the contents of this folder** to the repository root. `index.html` must be at repository root, not inside another folder.
4. Commit changes to the `main` branch.
5. In **Settings → Pages**, choose **Deploy from a branch**, `main`, and `/ (root)`; save.
6. Your project site will normally be at `https://YOUR-USERNAME.github.io/REPOSITORY/`. All links and assets use relative paths, so this project-path deployment works.
7. To use your already-purchased domain, enter it in **Settings → Pages → Custom domain**, then follow GitHub's current DNS instructions for your registrar: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
8. Enable HTTPS once DNS and GitHub Pages have finished validating the domain.

You can also deploy the folder on Netlify, Cloudflare Pages or any static web host. No commands are required.

## Folder structure

```
index.html
about.html
products.html
products/                 # 11 individual commodity pages
services.html
sourcing.html
markets.html
quality.html
contact.html
quote.html
faq.html
privacy.html
terms.html
assets/
  css/style.css
  js/config.js
  js/main.js
  images/                 # original logo, illustrations and favicon
.nojekyll
robots.txt
README.md
```

## How to update product information

Each page is ordinary HTML. Change the text in `products/<product>.html` and in the card on `products.html` or `index.html` as needed. Product vector art resides in `assets/images/<product>.svg`.

## SEO setup

The site ships with a technical SEO baseline for `https://alcanzaglobalexim.com`:

- Canonical URLs, Open Graph and Twitter card meta on every page.
- `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `Product` and `CollectionPage` JSON-LD structured data.
- `sitemap.xml` and a `robots.txt` that points to it.
- A branded `404.html` so missing URLs stay useful.
- Font connection preconnect hints for faster rendering.

When adding a new page:

1. Add the HTML file with a unique `<title>` and `<meta name="description">`.
2. Add a `link rel="canonical"` pointing to its final `https://alcanzaglobalexim.com/...` URL.
3. Add it to `sitemap.xml`.
4. If it is a product, reuse the existing product page pattern, including `Product` JSON-LD.

Search ranking also depends on factors outside this repository: verified Search Console/Bing Webmaster presence, genuinely useful content targeting buyer queries, and credible external links/mentions. No static file change can guarantee a #1 position.

## Important limitations of a truly static site

The original PRD described a CMS, admin enquiry dashboard, automatic customer acknowledgements and stored enquiry records. **Those features cannot work in plain static hosting without external services or a backend.** This version intentionally does not pretend to offer them. Formspree can supply form delivery and a basic submission dashboard if you configure it. For a full CMS or CRM, integrate a service in a later phase.

The site does not display unverified company addresses, certifications, supplier names, stock levels, logistics guarantees or prices. The contact details are purposefully blank until configured.

### Privacy and search

- Review `privacy.html` and `terms.html` for your registered jurisdiction and actual operational practices.
- The `googleAnalyticsId` setting is optional and blank by default. Add it only after reviewing any applicable tracking/consent requirements.
- Once your real domain is active, consider adding canonical URLs and a generated `sitemap.xml` using that confirmed domain.
- Google Fonts are requested over the network for typography, with system fallbacks if unavailable. Product illustrations, logo, CSS and JS are local.

## Supplier references (internal background only)

- https://eximparadise.com/#pdts
- https://www.vhtraders.com/kaima-rice/

These are reference sites, **not** attribution or permission to represent their inventory, certifications or brand as Alcanza Global's.
