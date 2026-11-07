// Modulo dimostrativo: la validazione è quella nativa del browser (attributi required/type),
// quindi l'evento submit arriva solo a modulo valido. In produzione la richiesta va inviata
// a un servizio di gestione moduli (es. Formspree o Web3Forms) e questo script si riduce o sparisce.
const form = document.getElementById('richiesta');
const status = document.getElementById('richiesta-esito');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.hidden = false;
  status.textContent = 'Grazie, la richiesta è stata registrata. La risposta arriverà entro due giorni lavorativi. (Versione dimostrativa: nessun dato è stato inviato.)';
  form.reset();
});
