// Tiny page bus so the header, footer and in-page CTAs can navigate or open
// the file picker without threading props through every section.
export const PAGES = ["home", "faq", "privacy"];

export const goTo = (page) =>
  window.dispatchEvent(new CustomEvent("picsly:nav", { detail: page }));

export const openPicker = () => {
  // Studio only mounts on the home page, so go there first.
  goTo("home");
  setTimeout(() => window.dispatchEvent(new Event("picsly:browse")), 0);
};
