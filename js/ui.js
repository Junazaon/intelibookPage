export function setFeedback(element, message = '', type = '') {
  element.textContent = message;
  element.className = `feedback${type ? ` ${type}` : ''}`;
}

export function setLoading(button, label, isLoading) {
  button.disabled = isLoading;
  label.textContent = isLoading ? 'Conectando...' : label.dataset.default;
}
