const sidebarStorageKey = "sl-sidebar-state";

interface SidebarState {
  hash: string;
  open: Array<boolean | null>;
  scroll: number;
}

function saveSidebarState() {
  const scroller = document.getElementById("starlight__sidebar");
  const stateContainer = scroller?.querySelector<HTMLElement>(
    "sl-sidebar-state-persist",
  );
  if (!scroller || !stateContainer) return;

  const open: Array<boolean | null> = [];
  for (const restorePoint of stateContainer.querySelectorAll<HTMLElement>(
    "sl-sidebar-restore",
  )) {
    const index = Number.parseInt(restorePoint.dataset.index ?? "", 10);
    const details = restorePoint.closest("details");
    if (!Number.isNaN(index) && details) open[index] = details.open;
  }

  try {
    sessionStorage.setItem(
      sidebarStorageKey,
      JSON.stringify({
        hash: stateContainer.dataset.hash ?? "",
        open,
        scroll: scroller.scrollTop,
      }),
    );
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

function restoreSidebarState() {
  const scroller = document.getElementById("starlight__sidebar");
  const stateContainer = scroller?.querySelector<HTMLElement>(
    "sl-sidebar-state-persist",
  );
  if (!scroller || !stateContainer) return;

  try {
    const state = JSON.parse(
      sessionStorage.getItem(sidebarStorageKey) ?? "null",
    ) as SidebarState | null;
    if (!state || state.hash !== stateContainer.dataset.hash) return;

    if (Array.isArray(state.open)) {
      for (const restorePoint of stateContainer.querySelectorAll<HTMLElement>(
        "sl-sidebar-restore",
      )) {
        const index = Number.parseInt(restorePoint.dataset.index ?? "", 10);
        const details = restorePoint.closest("details");
        const open = state.open[index];
        if (details && typeof open === "boolean") details.open = open;
      }
    }
    if (Number.isFinite(state.scroll)) scroller.scrollTop = state.scroll;
  } catch {
    // Ignore malformed or inaccessible session storage.
  }
}

document.addEventListener("astro:before-preparation", saveSidebarState);
document.addEventListener("astro:before-swap", saveSidebarState);
document.addEventListener("astro:after-swap", restoreSidebarState);
document.addEventListener("astro:page-load", restoreSidebarState);
window.addEventListener("pagehide", saveSidebarState);
