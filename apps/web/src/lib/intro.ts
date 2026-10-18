// First-visit intro coordination: the preloader announces when it has lifted,
// and animations that should play after it (the hero) wait for that moment.
export const INTRO_KEY = "amritasya-intro-seen";
const EVENT = "amritasya:intro-done";

declare global {
  interface Window { __introDone?: boolean }
}

export function markIntroDone() {
  window.__introDone = true;
  document.documentElement.classList.remove("intro-active");
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void) {
  if (window.__introDone || !document.documentElement.classList.contains("intro-active")) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}

// Runs before React hydrates so returning visitors never see a flash of the loader.
export const introBootScript = `try{if(!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&location.pathname!=="/render"){document.documentElement.classList.add("intro-active")}}catch(e){}`;
