/* Page lifecycle with Astro's ClientRouter: pages are swapped in place, so scripts run once
   but must set up each new page and clean up the old one. */

/** Signal that aborts when the current page is swapped out. */
let ac = new AbortController();
export const pageSignal = () => ac.signal;
document.addEventListener("astro:before-swap", () => { ac.abort(); ac = new AbortController(); });

/** Run `init` for the current page and for every page swapped in later (once per page). */
export function onEveryPage(name: string, init: (signal: AbortSignal) => void) {
  const run = () => {
    const root = document.getElementById("app");
    if (!root || root.dataset[`init_${name}`]) return;
    root.dataset[`init_${name}`] = "1";
    init(pageSignal());
  };
  document.addEventListener("astro:page-load", run);
  run();
}
