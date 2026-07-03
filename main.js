document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content-area');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const breadcrumb = document.getElementById('breadcrumb');

  function setActiveLink(page) {
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  function pathToContent(path) {
    // Strip base path (/docs/) and leading/trailing slashes
    let p = path.replace(/^\/docs/, '').replace(/^\/|\/$/g, '');
    // Remove file extension if present
    p = p.replace(/\.md$/, '');
    // Default to index
    if (!p) return 'content/index.md';
    // Map /api/intro -> content/api/intro.md
    return 'content/' + p + '.md';
  }

  function getCalloutIcon(type) {
    const icons = {
      warning: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      info: '<svg class="callout-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 14.5C4.41563 14.5 1.5 11.5841 1.5 8C1.5 4.41594 4.41563 1.5 8 1.5C11.5844 1.5 14.5 4.41594 14.5 8C14.5 11.5841 11.5844 14.5 8 14.5ZM9.25 10.5H8.75V7.75C8.75 7.3375 8.41563 7 8 7H7C6.5875 7 6.25 7.3375 6.25 7.75C6.25 8.1625 6.5875 8.5 7 8.5H7.25V10.5H6.75C6.3375 10.5 6 10.8375 6 11.25C6 11.6625 6.3375 12 6.75 12H9.25C9.66406 12 10 11.6641 10 11.25C10 10.8359 9.66563 10.5 9.25 10.5ZM8 6C8.55219 6 9 5.55219 9 5C9 4.44781 8.55219 4 8 4C7.44781 4 7 4.44687 7 5C7 5.55313 7.44687 6 8 6Z"/></svg>',
      danger: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      tip: '<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };
    return icons[type] || icons.info;
  }

  function renderCallouts(html) {
    // Match blockquotes that start with a strong tag containing Warning/Danger/Info/Tip
    return html.replace(
      /<blockquote>\s*<p><strong>(Warning|Danger|Info|Tip):?<\/strong>\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
      (match, type, content) => {
        const t = type.toLowerCase();
        return `<div class="callout callout-${t}"><div class="callout-icon">${getCalloutIcon(t)}</div><div class="callout-content"><p>${content.trim()}</p></div></div>`;
      }
    );
  }

  function getSectionLabel(page) {
    if (page.startsWith('content/api/')) return 'Shamrock API';
    if (page.startsWith('content/bot/')) return 'Bot';
    return '';
  }

  async function loadPage(page) {
    contentArea.innerHTML = '<div class="loading">Loading...</div>';

    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const md = await response.text();
      let html = marked.parse(md, { breaks: true, gfm: true });

      // Render callouts
      html = renderCallouts(html);

      // Build breadcrumb
      const section = getSectionLabel(page);
      const titleMatch = md.match(/^#\s+(.+)/m);
      const breadcrumbHtml = section
        ? `<div class="breadcrumb">${section}</div>`
        : '';

      contentArea.innerHTML = breadcrumbHtml + html;
      setActiveLink(page);

      // Update page title
      if (titleMatch) {
        document.title = `${titleMatch[1]} — Shamrock Systems`;
      }

      // Re-link hash links
      contentArea.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const id = a.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    } catch (err) {
      contentArea.innerHTML = `<div class="error">Failed to load page: ${err.message}</div>`;
    }
  }

  // Click handler for sidebar
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      history.pushState({ page }, '', `#${page}`);
      loadPage(page);
    });
  });

  // Determine which page to load
  function resolvePage() {
    // 1. Check for path from 404.html fallback
    if (window.__pagesPath) {
      const page = pathToContent(window.__pagesPath);
      // Clear it so subsequent hash nav works normally
      delete window.__pagesPath;
      return page;
    }
    // 2. Check hash
    if (location.hash) {
      return location.hash.slice(1);
    }
    // 3. Check current pathname
    const pathPage = pathToContent(location.pathname);
    if (pathPage !== 'content/index.md') {
      return pathPage;
    }
    // 4. Default
    return 'content/index.md';
  }

  // Initial load
  const initialPage = resolvePage();
  history.replaceState({ page: initialPage }, '', `#${initialPage}`);
  loadPage(initialPage);

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      loadPage(e.state.page);
    }
  });
});
