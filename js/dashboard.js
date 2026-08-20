import { getSession, clearSession } from './session.js';

const session = getSession();
if (!session) window.location.href = 'index.html';
else document.querySelector('#user-greeting').textContent = `Hola, ${session.username}`;

document.querySelector('#logout-button').addEventListener('click', () => {
  clearSession();
  window.location.href = 'index.html';
});
