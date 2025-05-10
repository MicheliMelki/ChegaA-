function recuperarSenha() {
  document.getElementById("modalRecuperar").style.display = "block";
}

function fecharModal() {
  document.getElementById("modalRecuperar").style.display = "none";
}

function enviarRecuperacao() {
  const email = document.getElementById("emailRecuperar").value.trim();
  const whatsapp = document.getElementById("whatsappRecuperar").value.trim();

  if (email || whatsapp) {
    alert(`Link de recuperação enviado para: ${email || whatsapp}`);
    fecharModal();
  } else {
    alert("Por favor, insira um e-mail ou número de WhatsApp.");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const sendRecoveryBtn = document.getElementById('sendRecovery');
  const recoveryEmailInput = document.getElementById('recoveryEmail');
  const recoveryMessage = document.getElementById('recoveryMessage');

  // Validação simples do login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    // Aqui você faria a autenticação real (API, backend...)
    alert(`Login realizado com sucesso!\nEmail: ${email}`);
    loginForm.reset();
  });

  // Abrir modal
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    recoveryEmailInput.value = '';
    recoveryMessage.textContent = '';
    recoveryEmailInput.focus();
  });

  // Fechar modal
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Fechar modal ao clicar fora do conteúdo
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Enviar recuperação de senha (simulação)
  sendRecoveryBtn.addEventListener('click', () => {
    const email = recoveryEmailInput.value.trim();
    if (!email) {
      recoveryMessage.style.color = 'red';
      recoveryMessage.textContent = 'Por favor, digite um email válido.';
      return;
    }
    recoveryMessage.style.color = 'green';
    recoveryMessage.textContent = `Link de recuperação enviado para ${email}.`;
    recoveryEmailInput.value = '';
  });
});


