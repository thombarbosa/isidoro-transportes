document.querySelector('.php-email-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Validar e-mail
  const email = formData.get('email');
  if (!validateEmail(email)) {
      form.querySelector('.error-message').innerText = 'Endereço de e-mail inválido.';
      form.querySelector('.error-message').classList.add('d-block');
      hideMessagesAfterDelay(form, 5000);
      return;
  }

  // Validar número de telefone
  const telefone = formData.get('telefone');
  if (!validatePhoneNumber(telefone)) {
      form.querySelector('.error-message').innerText = 'Número de telefone inválido.';
      form.querySelector('.error-message').classList.add('d-block');
      hideMessagesAfterDelay(form, 5000);
      return;
  }

  // Se todas as validações passarem, enviar o formulário
  fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
  }).then(response => {
      if (response.ok) {
          form.querySelector('.loading').classList.remove('d-block');
          form.querySelector('.sent-message').innerText = 'Sua mensagem foi enviada. Obrigado!';
          form.querySelector('.sent-message').classList.add('d-block');
          form.reset();
          hideMessagesAfterDelay(form, 5000);
      } else {
          return response.json().then(data => {
              form.querySelector('.loading').classList.remove('d-block');
              form.querySelector('.error-message').innerText = data.error || 'Erro no envio do formulário.';
              form.querySelector('.error-message').classList.add('d-block');
              hideMessagesAfterDelay(form, 5000);
          });
      }
  }).catch(error => {
      form.querySelector('.loading').classList.remove('d-block');
      form.querySelector('.error-message').innerText = 'Erro no envio do formulário. Tente novamente.';
      form.querySelector('.error-message').classList.add('d-block');
      hideMessagesAfterDelay(form, 5000);
  });
});

// Função para validar e-mail
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Função para validar número de telefone
function validatePhoneNumber(phone) {
  // Remove caracteres não numéricos
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Verifica se o número limpo tem exatamente 11 dígitos
  const phonePattern = /^\d{11}$/;
  return phonePattern.test(cleanedPhone);
}

// Função para esconder mensagens de erro e confirmação após um período de tempo
function hideMessagesAfterDelay(form, delay) {
  setTimeout(() => {
    form.querySelectorAll('.error-message, .sent-message').forEach(el => {
      el.classList.remove('d-block'); // Remove a classe que exibe a mensagem
      // Remove o texto das mensagens para evitar que permaneçam visíveis
      el.innerText = ''; // Limpa o texto das mensagens
    });
  }, delay);
}