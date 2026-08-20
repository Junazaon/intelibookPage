const API_URL = 'https://script.google.com/macros/s/AKfycbyJL1wzY51Yi5FQUq7l1IJwId0BuqHXukl8yW0jUF_Hn4KT_Zu6gxuPdZNW7CKthKK4/exec';

export async function sendRequest(action, username, password) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, username, password })
  });

  if (!response.ok) throw new Error('No se pudo conectar con el servidor.');
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}
