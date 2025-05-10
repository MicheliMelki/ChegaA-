// Script para gerenciar as encomendas
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const formEncomenda = document.getElementById('form-encomenda');
  const listaEncomendas = document.getElementById('lista-encomendas');
  const btnNovo = document.getElementById('btn-novo');
  const btnCancelar = document.getElementById('btn-cancelar');
  const noDataMessage = document.getElementById('no-data');
  const filterStatus = document.getElementById('filter-status');
  
  // Campos do formulário
  const encomendaId = document.getElementById('encomenda-id');
  const nomeMorador = document.getElementById('nomeMorador');
  const apartamento = document.getElementById('apartamento');
  const descricao = document.getElementById('descricao');
  const status = document.getElementById('status');
  const dataRecebimento = document.getElementById('dataRecebimento');
  const recebidoPor = document.getElementById('recebidoPor');
  
  // Inicializa com a data atual
  const dataAtual = new Date().toISOString().split('T')[0];
  dataRecebimento.value = dataAtual;
  
  // Array para armazenar as encomendas (simulando um banco de dados)
  let encomendas = JSON.parse(localStorage.getItem('encomendas')) || [];
  
  // Inicialização
  atualizarLista();
  
  // Event Listeners
  formEncomenda.addEventListener('submit', salvarEncomenda);
  btnNovo.addEventListener('click', limparFormulario);
  btnCancelar.addEventListener('click', limparFormulario);
  filterStatus.addEventListener('change', atualizarLista);
  
  // Funções
  function salvarEncomenda(e) {
    e.preventDefault();
    
    const id = encomendaId.value ? parseInt(encomendaId.value) : Date.now();
    const novaEncomenda = {
      id,
      nomeMorador: nomeMorador.value,
      apartamento: apartamento.value,
      descricao: descricao.value,
      status: status.value,
      dataRecebimento: dataRecebimento.value,
      recebidoPor: recebidoPor.value,
      dataAtualizacao: new Date().toISOString()
    };
    
    // Verifica se é uma edição ou novo cadastro
    if (encomendaId.value) {
      const index = encomendas.findIndex(encomenda => encomenda.id === parseInt(encomendaId.value));
      if (index !== -1) {
        encomendas[index] = novaEncomenda;
        mostrarNotificacao('Encomenda atualizada com sucesso!', 'success');
      }
    } else {
      encomendas.push(novaEncomenda);
      mostrarNotificacao('Encomenda cadastrada com sucesso!', 'success');
    }
    
    // Salva no localStorage e atualiza a lista
    localStorage.setItem('encomendas', JSON.stringify(encomendas));
    limparFormulario();
    atualizarLista();
  }
  
  function editarEncomenda(id) {
    const encomenda = encomendas.find(item => item.id === id);
    if (encomenda) {
      encomendaId.value = encomenda.id;
      nomeMorador.value = encomenda.nomeMorador;
      apartamento.value = encomenda.apartamento;
      descricao.value = encomenda.descricao;
      status.value = encomenda.status;
      dataRecebimento.value = encomenda.dataRecebimento;
      recebidoPor.value = encomenda.recebidoPor;
      
      // Scroll para o formulário
      formEncomenda.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function excluirEncomenda(id) {
    if (confirm('Tem certeza que deseja excluir esta encomenda?')) {
      encomendas = encomendas.filter(item => item.id !== id);
      localStorage.setItem('encomendas', JSON.stringify(encomendas));
      atualizarLista();
      mostrarNotificacao('Encomenda excluída com sucesso!', 'warning');
    }
  }
  
  function limparFormulario() {
    formEncomenda.reset();
    encomendaId.value = '';
    dataRecebimento.value = dataAtual;
  }
  
  function atualizarLista() {
    listaEncomendas.innerHTML = '';
    
    let encomendasFiltradas = encomendas;
    
    // Aplicar filtro por status
    const filtroStatus = filterStatus.value;
    if (filtroStatus !== 'TODOS') {
      encomendasFiltradas = encomendas.filter(item => item.status === filtroStatus);
    }
    
    // Mostrar mensagem de "sem dados" se não houver encomendas
    if (encomendasFiltradas.length === 0) {
      noDataMessage.classList.remove('hidden');
    } else {
      noDataMessage.classList.add('hidden');
      
      // Ordenar por data de atualização (mais recente primeiro)
      encomendasFiltradas.sort((a, b) => new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao));
      
      // Criar linhas da tabela
      encomendasFiltradas.forEach(encomenda => {
        const row = document.createElement('tr');
        
        // Formatar data para exibição
        const data = new Date(encomenda.dataRecebimento).toLocaleDateString('pt-BR');
        
        row.innerHTML = `
          <td>${encomenda.nomeMorador}</td>
          <td>${encomenda.apartamento}</td>
          <td>${encomenda.descricao}</td>
          <td>${data}</td>
          <td><span class="status-badge status-${encomenda.status}">${formatarStatus(encomenda.status)}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-icon view" onclick="visualizarDetalhes(${encomenda.id})" title="Visualizar">
                <i data-feather="eye"></i>
              </button>
              <button class="btn-icon edit" onclick="editarEncomenda(${encomenda.id})" title="Editar">
                <i data-feather="edit-2"></i>
              </button>
              <button class="btn-icon delete" onclick="excluirEncomenda(${encomenda.id})" title="Excluir">
                <i data-feather="trash-2"></i>
              </button>
            </div>
          </td>
        `;
        
        listaEncomendas.appendChild(row);
      });
      
      // Reinicializar os ícones
      feather.replace();
    }
  }
  
  function formatarStatus(status) {
    const statusMap = {
      'PENDENTE': 'Pendente',
      'RECEBIDA': 'Recebida',
      'ENTREGUE': 'Entregue'
    };
    return statusMap[status] || status;
  }
  
  function mostrarNotificacao(mensagem, tipo) {
    // Implementação básica de notificação
    alert(mensagem);
    
    // Aqui você poderia implementar uma notificação mais elegante
    // usando uma biblioteca ou criando um componente personalizado
  }
  
  // Funções globais (para usar inline no HTML)
  window.editarEncomenda = editarEncomenda;
  window.excluirEncomenda = excluirEncomenda;
  window.visualizarDetalhes = function(id) {
    const encomenda = encomendas.find(item => item.id === id);
    if (encomenda) {
      alert(`Detalhes da Encomenda:\n\nMorador: ${encomenda.nomeMorador}\nApartamento: ${encomenda.apartamento}\nDescrição: ${encomenda.descricao}\nStatus: ${formatarStatus(encomenda.status)}\nData: ${new Date(encomenda.dataRecebimento).toLocaleDateString('pt-BR')}\nRecebido por: ${encomenda.recebidoPor}`);
      
      // Aqui você poderia implementar uma visualização mais elegante,
      // como um modal com os detalhes completos
    }
  };
});