export function getSS(ssID) {
  return JSON.parse(sessionStorage.getItem(ssID));
}

export function setSS(name, value) {
  sessionStorage.setItem(name, JSON.stringify(value));
}

export function popSS(ssID) {
  sessionStorage.removeItem(ssID);
}

export function emptySS() {
  sessionStorage.clear();
}
