let mode = 'persistent';

export function setDbMode(nextMode) {
  mode = nextMode;
}

export function getDbMode() {
  return mode;
}

export function isOffline() {
  return mode === 'offline';
}
