/*
  GitHub Commit Newer/Older Indicators
  - Adds "Newer"/"Older" indicators on:
    1) Pull Request commits pages: /:owner/:repo/pull/:id/commits[/*]
    2) Repository commits pages:  /:owner/:repo/commits[/*]
  - Works with PJAX/Turbo navigation using MutationObserver and event hooks.
  - Idempotent: re-runs safely without duplicating indicators.
*/
(function () {
  const LABEL_CLASS = 'gh-noi-label';
  const TOP_CLASS = 'gh-noi-top';
  const BOTTOM_CLASS = 'gh-noi-bottom';
  const STYLE_ID = 'gh-noi-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${LABEL_CLASS} {
        font: 12px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        text-transform: uppercase;
        letter-spacing: .04em;
        color: var(--fgColor-muted, #57606a);
        border: 1px solid var(--borderColor-default, #d0d7de);
        border-left: 0;
        border-right: 0;
        padding: 6px 10px;
        margin: 6px 0;
        text-align: center;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  function firstContentChild(container) {
    const children = Array.from(container.childNodes);
    for (const c of children) {
      if (c.nodeType === Node.ELEMENT_NODE) return c;
    }
    return null;
  }

  function removeAllIndicators() {
    document.querySelectorAll(`.${LABEL_CLASS}`).forEach(n => n.remove());
  }

  function processPage() {
    const href = location.href;

    // Patterns for supported pages
    const ghPrCommitsRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+\/commits/;
    const jbSpaceReviewsFilesRegex = /^https:\/\/([a-z0-9-]+\.)?jetbrains\.team\/p\/[^/]+\/repositories\/[^/]+\/reviews\/\d+\/files/i;

    // Always clear previously injected labels to keep idempotence
    removeAllIndicators();

    // Decide target container based on URL
    let container = null;
    let site = null
    if (ghPrCommitsRegex.test(href)) {
      site = 'github';
      container = document.querySelector('div[data-testid="commits-list"]'); // Match <div data-testid="commits-list" data-hpc="true">
    } else if (jbSpaceReviewsFilesRegex.test(href)) {
      site = 'space';
      container = document.querySelector('div[role="list"]'); // Match <div role="list" class="ksc-130 FlexStyles-vertical-none XTreeStyles-tree"> <div role="list" class="ksc-123 FlexStyles-vertical-none XTreeStyles-tree">
    }

    if (!container) return;

    // Optional style for readability (safe to include)
    ensureStyle();

    const topLabel = document.createElement('div');
    topLabel.className = `${LABEL_CLASS} ${TOP_CLASS}`;

    const bottomLabel = document.createElement('div');
    bottomLabel.className = `${LABEL_CLASS} ${BOTTOM_CLASS}`;

    if (site === 'space') {
      // JetBrains Space: Newer first, Older last
      topLabel.textContent = 'Newer';
      bottomLabel.textContent = 'Older';
    } else {
      // GitHub: Older first, Newer last
      topLabel.textContent = 'Older';
      bottomLabel.textContent = 'Newer';
    }

    container.prepend(topLabel);
    container.appendChild(bottomLabel);
  }

  // Observe DOM changes and re-run with debounce
  let scheduled = false;
  function scheduleProcess() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      processPage();
    }, 150);
  }

  // Hook into PJAX/Turbo events if present
  document.addEventListener('pjax:end', processPage);
  document.addEventListener('turbo:load', processPage);
  document.addEventListener('turbo:render', scheduleProcess);

  const mo = new MutationObserver(scheduleProcess);
  mo.observe(document.documentElement, { subtree: true, childList: true });

  // Run on start and on history navigation
  processPage();
  const origPush = history.pushState;
  history.pushState = function () {
    origPush.apply(this, arguments);
    scheduleProcess();
  };
  window.addEventListener('popstate', scheduleProcess);
})();
