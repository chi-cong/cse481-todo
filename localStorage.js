export function getLocalItem(itemKey) {
  const jsonString = localStorage.getItem(itemKey);
  if (typeof jsonString === "string") {
    return JSON.parse(jsonString);
  }
}

export function deleteLocalItem(itemKey) {
  localStorage.removeItem(itemKey);
}

export function setLocalItem(itemKey, value) {
  localStorage.setItem(itemKey, JSON.stringify(value));
}
