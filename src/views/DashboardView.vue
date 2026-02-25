<template>
  <div>
    <h1>Dashboard - Ordens de Produção</h1>
    
    <!-- Quadro de Resumo do Mês Atual -->
    <div class="resumo-atual">
      <h3>Resumo do Mês Atual ({{ mesAtualFormatado }})</h3>
      <div class="resumo-grid">
        <div class="resumo-item">
          <strong>Jhony</strong>
          <p>Peças: {{ resumo.jhony.quantidade }}</p>
          <p>Valor: R$ {{ resumo.jhony.valor.toFixed(2) }}</p>
        </div>
        <div class="resumo-item">
          <strong>Ana</strong>
          <p>Peças: {{ resumo.ana.quantidade }}</p>
          <p>Valor: R$ {{ resumo.ana.valor.toFixed(2) }}</p>
        </div>
        <div class="resumo-item">
          <strong>Helen</strong>
          <p>Peças: {{ resumo.helen.quantidade }}</p>
          <p>Valor: R$ {{ resumo.helen.valor.toFixed(2) }}</p>
        </div>
        <div class="resumo-item">
          <strong>Terceiros</strong>
          <p>Peças: {{ resumo.terceiros.quantidade }}</p>
          <p>Valor: R$ {{ resumo.terceiros.valor.toFixed(2) }}</p>
        </div>
        <div class="resumo-total">
          <strong>Total Geral</strong>
          <p>Peças: {{ resumo.total.quantidade }}</p>
          <p>Valor: R$ {{ resumo.total.valor.toFixed(2) }}</p>
        </div>
      </div>
    </div>      
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const ordens = ref([]);

// Data atual para cálculos
const dataAtual = new Date();
const mesAtual = dataAtual.getMonth();
const anoAtual = dataAtual.getFullYear();

const mesAtualFormatado = computed(() => {
  return dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
});

// Filtra apenas ordens do mês atual
const ordensDoMes = computed(() => {
  return ordens.value.filter(ordem => {
    const dataOrdem = new Date(ordem.data);
    return dataOrdem.getMonth() === mesAtual && dataOrdem.getFullYear() === anoAtual;
  });
});

// Resumo computado apenas do mês atual
const resumo = computed(() => {
  const inicial = {
    jhony: { quantidade: 0, valor: 0 },
    ana: { quantidade: 0, valor: 0 },
    helen: { quantidade: 0, valor: 0 },
    terceiros: { quantidade: 0, valor: 0 },
    total: { quantidade: 0, valor: 0 }
  };

  return ordensDoMes.value.reduce((acc, ordem) => {
    ordem.responsaveis.forEach(resp => {
      if (resp.quantidade > 0) {
        if (resp.nome.toLowerCase().includes('jhony')) {
          acc.jhony.quantidade += resp.quantidade;
          acc.jhony.valor += resp.valor;
        } else if (resp.nome.toLowerCase().includes('ana')) {
          acc.ana.quantidade += resp.quantidade;
          acc.ana.valor += resp.valor;
        } else if (resp.nome.toLowerCase().includes('helen')) {
          acc.helen.quantidade += resp.quantidade;
          acc.helen.valor += resp.valor;
        } else {
          acc.terceiros.quantidade += resp.quantidade;
          acc.terceiros.valor += resp.valor;
        }
        
        acc.total.quantidade += resp.quantidade;
        acc.total.valor += resp.valor;
      }
    });
    return acc;
  }, { ...inicial });
});

onMounted(() => {
  carregarOrdens();
});

function carregarOrdens() {
  const dados = localStorage.getItem("of-lista");
  if (dados) {
    ordens.value = JSON.parse(dados);
  }
}

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
}
</script>

<style scoped>
.resumo-atual {
  background: #f8f9fa;
  border: 2px solid #1d3557;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}

.resumo-atual h3 {
  margin-top: 0;
  color: #1d3557;
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.resumo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.resumo-item, .resumo-total {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #1d3557;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.resumo-total {
  background: #1d3557;
  color: white;
  border-left: 4px solid #2a9d8f;
  grid-column: 1 / -1;
  text-align: center;
}

.resumo-item strong {
  color: #1d3557;
  display: block;
  margin-bottom: 8px;
}

.resumo-total strong {
  font-size: 1.1em;
  display: block;
  margin-bottom: 8px;
}

.resumo-item p, .resumo-total p {
  margin: 4px 0;
  font-size: 0.9em;
}

.ofs-container {
  background: white;
  border-radius: 10px;
  border: 1px solid #ddd;
  overflow: hidden;
}

.ofs-header {
  background: #457b9d;
  color: white;
  padding: 15px 20px;
}

.ofs-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.ofs-list {
  padding: 20px;
  display: grid;
  gap: 15px;
}

.of-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.of-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.of-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.of-info-principal {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.of-numero {
  color: #1d3557;
  font-size: 1.1em;
}

.of-data {
  color: #666;
  font-size: 0.9em;
}

.of-totais {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.of-quantidade {
  background: #1d3557;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.of-valor {
  color: #2a9d8f;
  font-weight: bold;
  font-size: 0.9em;
}

.of-detalhes {
  margin-bottom: 10px;
}

.detalhe-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #666;
}

.of-responsaveis h4 {
  margin: 0 0 8px 0;
  color: #1d3557;
  font-size: 0.9em;
}

.responsaveis-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.responsavel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #2a9d8f;
}

.resp-nome {
  font-weight: 500;
  color: #1d3557;
}

.resp-quantidade {
  color: #666;
  font-size: 0.85em;
}

.resp-valor {
  color: #2a9d8f;
  font-weight: bold;
  font-size: 0.85em;
}

.sem-responsaveis {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.btn-nova-of {
  background: #1d3557;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
}

.btn-nova-of:hover {
  background: #457b9d;
}
</style>