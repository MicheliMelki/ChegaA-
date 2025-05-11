// Funções para mostrar/esconder seções de login e cadastro
function mostrarCadastro() {
    const loginBox = document.getElementById("login-box");
    const cadastroBox = document.getElementById("cadastro-box");
    const loginMessage = document.getElementById("login-message");

    if (loginBox) {
        loginBox.classList.add("hidden");
    }
    if (cadastroBox) {
        cadastroBox.classList.remove("hidden");
    }
    if (loginMessage) {
        loginMessage.classList.add("hidden"); // Limpa mensagens
    }
}

function mostrarLogin() {
    const cadastroBox = document.getElementById("cadastro-box");
    const loginBox = document.getElementById("login-box");
    const cadastroMessage = document.getElementById("cadastro-message");

    if (cadastroBox) {
        cadastroBox.classList.add("hidden");
    }
    if (loginBox) {
        loginBox.classList.remove("hidden");
    }
    if (cadastroMessage) {
        cadastroMessage.classList.add("hidden"); // Limpa mensagens
    }
}

// Funções para mostrar/esconder modal de recuperação de senha
function mostrarModalRecuperar() {
    const modalRecuperar = document.getElementById("modalRecuperar");
    const recuperarMessage = document.getElementById("recuperar-message");

    if (modalRecuperar) {
        modalRecuperar.classList.remove("hidden");
    }
    if (recuperarMessage) {
        recuperarMessage.classList.add("hidden"); // Limpa mensagens
    }
}

function fecharModalRecuperar() {
    const modalRecuperar = document.getElementById("modalRecuperar");
    if (modalRecuperar) {
        modalRecuperar.classList.add("hidden");
    }
}

// Função para mostrar/esconder senha
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const iconElement = input.nextElementSibling;
    if (!iconElement || !iconElement.querySelector) return;
    const icon = iconElement.querySelector('i');

    if (input.type === "password") {
        input.type = "text";
        if (icon) {
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    } else {
        input.type = "password";
        if (icon) {
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }
}

// Evento para fechar modal ao clicar fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalRecuperar');
    if (modal && event.target === modal) {
        fecharModalRecuperar();
    }
});

// Manipulação do formulário de login (integração futura com backend)
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Lógica de validação e envio para o backend
        console.log("Formulário de login enviado");

        // Exemplo simulado de exibição de mensagem de erro
        // const loginMessage = document.getElementById("login-message");
        // if (loginMessage) {
        //     const span = loginMessage.querySelector('span');
        //     if (span) {
        //         span.textContent = "E-mail ou senha incorretos. Tente novamente.";
        //     }
        //     loginMessage.classList.remove("hidden");
        // }
    });
}

const cadastroForm = document.getElementById("cadastro-form");
if (cadastroForm) {
    cadastroForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Validação de senha
        const senhaInput = document.getElementById("cadastro-senha");
        const confirmaSenhaInput = document.getElementById("cadastro-confirma-senha");
        const cadastroMessage = document.getElementById("cadastro-message");

        if (senhaInput && confirmaSenhaInput && cadastroMessage) {
            const senha = senhaInput.value;
            const confirmaSenha = confirmaSenhaInput.value;

            if (senha !== confirmaSenha) {
                cadastroMessage.classList.remove("success");
                cadastroMessage.classList.add("error");
                const icon = cadastroMessage.querySelector('i');
                const span = cadastroMessage.querySelector('span');
                if (icon) icon.className = "fas fa-exclamation-circle";
                if (span) span.textContent = "As senhas não coincidem. Tente novamente.";
                cadastroMessage.classList.remove("hidden");
                return;
            }

            // Lógica de envio para o backend
            console.log("Formulário de cadastro enviado");

            // Exemplo simulado de sucesso
            // cadastroMessage.classList.remove("error");
            // cadastroMessage.classList.add("success");
            // const icon = cadastroMessage.querySelector('i');
            // const span = cadastroMessage.querySelector('span');
            // if (icon) icon.className = "fas fa-check-circle";
            // if (span) span.textContent = "Cadastro realizado com sucesso! Redirecionando...";
            // cadastroMessage.classList.remove("hidden");

            // Redirecionar após 2 segundos (simulação)
            // setTimeout(() => {
            //     mostrarLogin();
            // }, 2000);
        }
    });
}

const recuperarForm = document.getElementById("recuperar-form");
if (recuperarForm) {
    recuperarForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const emailInput = document.getElementById("recuperar-email");
        const whatsappInput = document.getElementById("recuperar-whatsapp");
        const recuperarMessage = document.getElementById("recuperar-message");

        if (recuperarMessage) {
            const email = emailInput ? emailInput.value : "";
            const whatsapp = whatsappInput ? whatsappInput.value : "";

            if (!email && !whatsapp) {
                recuperarMessage.classList.remove("success");
                recuperarMessage.classList.add("error");
                const icon = recuperarMessage.querySelector('i');
                const span = recuperarMessage.querySelector('span');
                if (icon) icon.className = "fas fa-exclamation-circle";
                if (span) span.textContent = "Informe o e-mail ou WhatsApp.";
                recuperarMessage.classList.remove("hidden");
                return;
            }

            // Lógica de envio para o backend
            console.log("Formulário de recuperação enviado");

            // Exemplo simulado de sucesso
            recuperarMessage.classList.remove("error");
            recuperarMessage.classList.add("success");
            const icon = recuperarMessage.querySelector('i');
            const span = recuperarMessage.querySelector('span');
            if (icon) icon.className = "fas fa-check-circle";
            if (span) span.textContent = "Link de recuperação enviado com sucesso! Verifique seu e-mail ou WhatsApp.";
            recuperarMessage.classList.remove("hidden");

            // Fechar modal após 3 segundos (simulação)
            setTimeout(() => {
                fecharModalRecuperar();
            }, 3000);
        }
    });
}

// Máscara para WhatsApp
const whatsappInputs = document.querySelectorAll('input[type="tel"]');
whatsappInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 0) {
            // Aplica a máscara (XX) XXXXX-XXXX
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }

        e.target.value = value;
    });
});