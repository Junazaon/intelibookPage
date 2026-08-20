import { sendRequest } from './api.js';
import { startSession, getSession } from './session.js';
import { setFeedback, setLoading } from './ui.js';

const form = document.querySelector('#auth-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const passwordHint = document.querySelector('#password-hint');
const passwordCount = document.querySelector('#password-count');
const feedback = document.querySelector('#feedback');
const submitButton = document.querySelector('#submit-button');
const submitLabel = document.querySelector('#submit-label');
const formTitle = document.querySelector('#form-title');
const formSubtitle = document.querySelector('#form-subtitle');
const loginTab = document.querySelector('#login-tab');
const registerTab = document.querySelector('#register-tab');
const togglePassword = document.querySelector('#toggle-password');
let mode = 'login';

if (getSession()) window.location.href = 'dashboard.html';
submitLabel.dataset.default = 'Entrar a Libretas';

function switchMode(nextMode) {
  mode = nextMode;
  const isRegister = mode === 'register';
  loginTab.classList.toggle('is-active', !isRegister);
  registerTab.classList.toggle('is-active', isRegister);
  loginTab.setAttribute('aria-selected', String(!isRegister));
  registerTab.setAttribute('aria-selected', String(isRegister));
  formTitle.textContent = isRegister ? 'Crea tu cuenta' : 'Entra a tu cuenta';
  formSubtitle.textContent = isRegister ? 'Un espacio propio para tus mejores ideas.' : 'Continúa donde lo dejaste.';
  submitLabel.dataset.default = isRegister ? 'Crear mi cuenta' : 'Entrar a Libretas';
  submitLabel.textContent = submitLabel.dataset.default;
  passwordInput.autocomplete = isRegister ? 'new-password' : 'current-password';
  passwordHint.textContent = isRegister ? 'Entre 6 y 8 caracteres.' : 'Tu contraseña de acceso.';
  setFeedback(feedback);
}

function validateRegistration(password) {
  if (password.length < 6 || password.length > 8) {
    passwordHint.textContent = 'La contraseña debe tener entre 6 y 8 caracteres.';
    return false;
  }
  return true;
}

loginTab.addEventListener('click', () => switchMode('login'));
registerTab.addEventListener('click', () => switchMode('register'));
passwordInput.addEventListener('input', () => { passwordCount.textContent = `${passwordInput.value.length} / 8`; });
togglePassword.addEventListener('click', () => {
  const shouldShow = passwordInput.type === 'password';
  passwordInput.type = shouldShow ? 'text' : 'password';
  togglePassword.setAttribute('aria-label', shouldShow ? 'Ocultar contraseña' : 'Mostrar contraseña');
  togglePassword.title = shouldShow ? 'Ocultar contraseña' : 'Mostrar contraseña';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  setFeedback(feedback);
  if (!username) return setFeedback(feedback, 'Escribe tu nombre de usuario.', 'error');
  if (mode === 'register' && !validateRegistration(password)) return setFeedback(feedback, 'Revisa los datos antes de continuar.', 'error');
  setLoading(submitButton, submitLabel, true);
  try {
    const result = await sendRequest(mode, username, password);
    if (mode === 'login') {
      if (result === true) { startSession(username); window.location.href = 'dashboard.html'; return; }
      setFeedback(feedback, 'El usuario o la contraseña no son correctos.', 'error');
    } else if (result === 'success') {
      setFeedback(feedback, 'Cuenta creada. Ya puedes iniciar sesión.', 'success');
      switchMode('login');
      usernameInput.value = username;
      passwordInput.value = '';
      passwordCount.textContent = '0 / 8';
    } else if (result === 'alreadyTaken') setFeedback(feedback, 'Ese usuario ya existe.', 'error');
    else if (result === 'invalidPassword') setFeedback(feedback, 'La contraseña debe tener entre 6 y 8 caracteres.', 'error');
    else if (result === 'invalidUsername') setFeedback(feedback, 'El usuario contiene caracteres no permitidos.', 'error');
    else setFeedback(feedback, 'No pudimos completar la operación.', 'error');
  } catch (error) { setFeedback(feedback, error.message, 'error'); }
  finally { setLoading(submitButton, submitLabel, false); }
});
