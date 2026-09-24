// Tiny shared flag: is an opaque section currently covering the whole screen?
// The Evolve journey sets it while pinned; the 3D background reads it to stop
// rendering frames nobody can see. Module state plus a window event, since the
// two components live in unrelated parts of the tree.
const EVENT = "evogency:scene-covered";
let covered = false;

export function setSceneCovered(next: boolean) {
  if (next === covered) return;
  covered = next;
  window.dispatchEvent(new Event(EVENT));
}

export function isSceneCovered() {
  return covered;
}

export function onSceneCoveredChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
