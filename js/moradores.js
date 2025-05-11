document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("morador-form");
  const listaMoradores = document.getElementById("lista-moradores");
  const searchInput = document.getElementById("search-input");
  const noResults = document.getElementById("no-results");
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const closeBtn = document.getElementById("close-notification");
  const moradorIdInput = document.getElementById("morador-id");
  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmationMessageModal = document.getElementById("confirmation-message");
  const confirmButton = document.getElementById("confirm-button");
  const cancelButton = document.getElementById("cancel-button");
  let moradorIndexParaExcluir = null;

  let moradores = [];
  renderizarMoradores(); // Inicializa a lista ao carregar a página

  function mostrarNotificacao(mensagem, tipo = "") {
    notificationMessage.textContent = mensagem;
    notification.className = `notification show ${tipo}`;
    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }

  closeBtn.addEventListener("click", () => {
    notification.classList.remove("show");
  });

  function renderizarMoradores() {
    listaMoradores.innerHTML = "";
    if (moradores.length === 0) {
      noResults.classList.remove("hidden");
    } else {
      noResults.classList.add("hidden");
      moradores.forEach((morador, index) => {
        const li = document.createElement("li");
        li.classList.add("morador-item");
        li.innerHTML = `
          <span>${morador.nome}</span>
          <span>${morador.apartamento}</span>
          <span>${morador.telefone}</span>
          <span>${morador.email}</span>
          <div class="morador-acoes">
            <button class="btn-action btn-edit" title="Editar" data-index="${index}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action btn-delete" title="Excluir" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        listaMoradores.appendChild(li);
      });

      // Adicionar event listeners para os botões de editar e excluir APÓS a renderização
      document.querySelectorAll('.btn-action.btn-edit').forEach(button => {
        button.addEventListener('click', editarMorador);
      });

      document.querySelectorAll('.btn-action.btn-delete').forEach(button => {
        button.addEventListener('click', confirmarExclusao); // Chame confirmarExclusao
      });
    }
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const apartamento = document.getElementById("apartamento").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const index = document.getElementById("morador-id").value;

    const morador = { nome, apartamento, telefone, email };

    if (index !== "") {
      moradores[index] = morador;
      document.getElementById("morador-id").value = "";
      mostrarNotificacao("Morador atualizado com sucesso!", "success");
    } else {
      moradores.push(morador);
      mostrarNotificacao("Morador cadastrado com sucesso!", "success");
    }

    form.reset();
    renderizarMoradores();
  });

  searchInput.addEventListener("input", function() {
    const termoBusca = searchInput.value.toLowerCase();
    const resultados = moradores.filter(morador =>
      morador.nome.toLowerCase().includes(termoBusca) ||
      morador.apartamento.toLowerCase().includes(termoBusca) ||
      morador.telefone.toLowerCase().includes(termoBusca) ||
      morador.email.toLowerCase().includes(termoBusca)
    );
    listaMoradores.innerHTML = "";
    if (resultados.length === 0) {
      noResults.classList.remove("hidden");
    } else {
      noResults.classList.add("hidden");
      resultados.forEach((morador, index) => {
        const li = document.createElement("li");
        li.classList.add("morador-item");
        li.innerHTML = `
          <span>${morador.nome}</span>
          <span>${morador.apartamento}</span>
          <span>${morador.telefone}</span>
          <span>${morador.email}</span>
          <div class="morador-acoes">
            <button class="btn-action btn-edit" title="Editar" data-index="${moradores.indexOf(morador)}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action btn-delete" title="Excluir" data-index="${moradores.indexOf(morador)}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        listaMoradores.appendChild(li);
      });
      document.querySelectorAll('.btn-action.btn-edit').forEach(button => {
        button.addEventListener('click', editarMorador);
      });

      document.querySelectorAll('.btn-action.btn-delete').forEach(button => {
        button.addEventListener('click', confirmarExclusao); // Chame confirmarExclusao
      });
    }
  });

  function editarMorador(event) {
    const index = event.target.closest('.btn-action').dataset.index;
    const morador = moradores[index];
    document.getElementById("morador-id").value = index;
    document.getElementById("nome").value = morador.nome;
    document.getElementById("apartamento").value = morador.apartamento;
    document.getElementById("telefone").value = morador.telefone;
    document.getElementById("email").value = morador.email;
  }

  function confirmarExclusao(event) {
    moradorIndexParaExcluir = event.target.closest('.btn-action').dataset.index;
    const moradorParaExcluir = moradores[moradorIndexParaExcluir];
    if (moradorParaExcluir) {
      confirmationMessageModal.textContent = `Tem certeza que deseja excluir o morador "${moradorParaExcluir.nome}"?`;
      confirmationModal.classList.remove("hidden");
    }
  }

  confirmButton.addEventListener("click", () => {
    if (moradorIndexParaExcluir !== null) {
      moradores.splice(moradorIndexParaExcluir, 1);
      renderizarMoradores();
      mostrarNotificacao("Morador excluído com sucesso!", "success");
      moradorIndexParaExcluir = null;
    }
    confirmationModal.classList.add("hidden");
  });

  cancelButton.addEventListener("click", () => {
    moradorIndexParaExcluir = null;
    confirmationModal.classList.add("hidden");
  });

  renderizarMoradores(); // Inicializa a lista
});