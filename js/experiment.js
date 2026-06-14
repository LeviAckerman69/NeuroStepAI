export const state = {
  running: false,
  progress: 0,
};

export function reset() {
  state.running = false;
  state.progress = 0;
}

export function start() {
  state.running = true;
  state.progress = 0;
}
