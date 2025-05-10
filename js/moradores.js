/**
 * Sistema de Gestão de Moradores
 * 
 * Este arquivo contém todas as funcionalidades JavaScript para a gestão de moradores,
 * incluindo adicionar, editar, excluir e pesquisar moradores.
 */

// Inicialização do módulo
document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const moradorForm = document.getElementById('morador-form');
  const moradorIdInput = document.getElementById('morador-id');
  const nomeInput = document.getElementById('nome');
  const apartamentoInput = document.getElementById('apartamento');
  const telefoneInput = document.getElementById('telefone');
  const emailInput = document.getElementById('email');
  const listaMoradores = document.getElementById('lista-moradores');
  const searchInput = document.getElementById('search-input');
  const noResults = document.getElementById('no-results');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const closeNotification = document.getElementById('close-notification');

  // Inicialização
  loadMoradores();
  setupEventListeners();
  mascararTelefone();

  /**
   * Configuração de todos os event listeners
   */
  function setupEventListeners() {
    // Form de cadastro/edição
    moradorForm.addEventListener('submit', handleFormSubmit);
    
    // Pesquisa em tempo real
    searchInput.addEventListener('input', handleSearch);
    
    // Fechar notificação
    closeNotification.addEventListener('click', () => hideNotification());
  }

  /**
   * Manipula o envio do formulário para salvar ou atualizar um morador
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validação do formulário
    if (!validateForm()) {
      return;
    }

    const morador = {
      id: moradorIdInput.value || generateId(),
      nome: nomeInput.value.trim(),
      apartamento: apartamentoInput.value.trim(),
      telefone: telefoneInput.value.trim(),
      email: emailInput.value.trim(),
    };

    // Verifica se é edição ou cadastro
    if (moradorIdInput.value) {
      updateMorador(morador);
      showNotification('Morador atualizado com sucesso!');
    } else {
      addMorador(morador);
      showNotification('Morador cadastrado com sucesso!');
    }

    // Limpa o formulário
    moradorForm.reset();
    moradorIdInput.value = '';
    
    // Recarrega a lista de moradores
    loadMoradores();
  }

  /**
   * Valida o formulário antes do envio
   */
  function validateForm() {
    // Validação básica dos campos
    if (!nomeInput.value.trim()) {
      showNotification('Por favor, preencha o nome do morador.', 'error');
      nomeInput.focus();
      return false;
    }

    if (!apartamentoInput.value.trim()) {
      showNotification('Por favor, preencha o apartamento do morador.', 'error');
      apartamentoInput.focus();
      return false;
    }

    if (!validatePhone(telefoneInput.value)) {
      showNotification('Por favor, insira um número de telefone válido.', 'error');
      telefoneInput.focus();
      return false;
    }

    if (!validateEmail(emailInput.value)) {
      showNotification('Por favor, insira um e-mail válido.', 'error');
      emailInput.focus();
      return false;
    }

    return true;
  }

  /**
   * Valida formato de e-mail
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  /**
   * Valida formato de telefone
   */
  function validatePhone(phone) {
    // Remove caracteres não numéricos para validação
    const numericPhone = phone.replace(/\D/g, '');
    // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
    return numericPhone.length >= 10 && numericPhone.length <= 11;
  }

  /**
   * Aplica máscara ao campo de telefone
   */
  function mascararTelefone() {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (value.length > 0) {
        // Aplica a máscara conforme o usuário digita
        if (value.length <= 2) {
          formattedValue = `(${value}`;
        } else if (value.length <= 6) {
          formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        } else if (value.length <= 10) {
          formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
        } else {
          formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
        }
        
        e.target.value = formattedValue;
      }
    });
  }

  /**
   * Adiciona um novo morador
   */
  function addMorador(morador) {
    const moradores = getMoradores();
    moradores.push(morador);
    localStorage.setItem('moradores', JSON.stringify(moradores));
  }

  /**
   * Atualiza um morador existente
   */
  function updateMorador(moradorAtualizado) {
    const moradores = getMoradores();
    const index = moradores.findIndex(m => m.id === moradorAtualizado.id);
    
    if (index !== -1) {
      moradores[index] = moradorAtualizado;
      localStorage.setItem('moradores', JSON.stringify(moradores));
    }
  }

  /**
   * Exclui um morador
   */
  function deleteMorador(id) {
    if (confirm('Tem certeza que deseja excluir este morador?')) {
      const moradores = getMoradores();
      const filteredMoradores = moradores.filter(morador => morador.id !== id);
      localStorage.setItem('moradores', JSON.stringify(filteredMoradores));
      
      showNotification('Morador excluído com sucesso!');
      loadMoradores();
    }
  }

  /**
   * Edita um morador existente
   */
  function editMorador(id) {
    const moradores = getMoradores();
    const morador = moradores.find(m => m.id === id);
    
    if (morador) {
      // Preenche o formulário com os dados do morador
      moradorIdInput.value = morador.id;
      nomeInput.value = morador.nome;
      apartamentoInput.value = morador.apartamento;
      telefoneInput.value = morador.telefone;
      emailInput.value = morador.email;
      
      // Rola a página até o formulário
      document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
      
      // Foca no campo nome
      nomeInput.focus();
    }
  }

  /**
   * Carrega a lista de moradores
   */
  function loadMoradores(searchTerm = '') {
    const moradores = getMoradores();
    listaMoradores.innerHTML = '';

    let moradoresFiltrados = moradores;
    
    // Filtra os moradores se houver termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      moradoresFiltrados = moradores.filter(morador => 
        morador.nome.toLowerCase().includes(term) || 
        morador.apartamento.toLowerCase().includes(term) || 
        morador.telefone.toLowerCase().includes(term) || 
        morador.email.toLowerCase().includes(term)
      );
    }

    // Exibe mensagem quando não há resultados
    if (moradoresFiltrados.length === 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
    }

    // Renderiza a lista de moradores
    moradoresFiltrados.forEach(morador => {
      const li = document.createElement('li');
      li.className = 'morador-item';
      li.innerHTML = `
        <span data-label="Nome:">${morador.nome}</span>
        <span data-label="Apartamento:">${morador.apartamento}</span>
        <span data-label="Telefone:">${morador.telefone}</span>
        <span data-label="E-mail:">${morador.email}</span>
        <div class="morador-acoes">
          <button class="btn btn-primary btn-icon edit-btn" data-id="${morador.id}" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-icon delete-btn" data-id="${morador.id}" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      // Adiciona eventos aos botões
      const editBtn = li.querySelector('.edit-btn');
      const deleteBtn = li.querySelector('.delete-btn');
      
      editBtn.addEventListener('click', () => editMorador(morador.id));
      deleteBtn.addEventListener('click', () => deleteMorador(morador.id));
      
      listaMoradores.appendChild(li);
    });
  }

  /**
   * Manipula a pesquisa em tempo real
   */
  function handleSearch() {
    const searchTerm = searchInput.value.trim();
    loadMoradores(searchTerm);
  }

  /**
   * Obtém a lista de moradores do localStorage
   */
  function getMoradores() {
    const moradores = localStorage.getItem('moradores');
    return moradores ? JSON.parse(moradores) : [];
  }

  /**
   * Gera um ID único para um novo morador
   */
  function generateId() {
    return Date.now().toString();
  }

  /**
   * Exibe uma notificação
   */
  function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // Esconde a notificação após 5 segundos
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  /**
   * Esconde a notificação
   */
  function hideNotification() {
    notification.classList.add('hidden');
  }
});