<template>
  <div>
    <h1>Histórico de Fechamentos Mensais</h1>

    <div v-if="fechamentos.length === 0" class="empty-state">
      <p>Nenhum fechamento mensal encontrado.</p>
    </div>

    <div v-else class="fechamentos-list">
      <div 
        v-for="fechamento in fechamentos" 
        :key="fechamento.mes" 
        class="fechamento-card"
        @click="verDetalhes(fechamento)"
      >
        <div class="fechamento-header">
          <h3>{{ formatarMesAno(fechamento.mes) }}</h3>
          <span class="periodo">
            {{ formatarData(fechamento.dataInicio) }} a {{ formatarData(fechamento.dataFim) }}
          </span>
        </div>
        
        <div class="fechamento-resumo">
          <div class="resumo-item">
            <strong>Total OFs:</strong> {{ fechamento.totalOFs }}
          </div>
          <div class="resumo-item">
            <strong>Total Peças:</strong> {{ fechamento.resumo.total.quantidade }}
          </div>
          <div class="resumo-item">
            <strong>Total Valor:</strong> R$ {{ fechamento.resumo.total.valor.toFixed(2) }}
          </div>
        </div>

        <div class="responsaveis-resumo">
          <div class="resp-item" v-for="(valor, nome) in fechamento.resumo" :key="nome">
            <span v-if="nome !== 'total'" class="resp-nome">{{ nome }}:</span>
            <span v-if="nome !== 'total'" class="resp-valor">
              {{ valor.quantidade }} pç (R$ {{ valor.valor.toFixed(2) }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="fechamentoSelecionado" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalhes - {{ formatarMesAno(fechamentoSelecionado.mes) }}</h2>
          <button @click="fecharModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="periodo-info">
            <strong>Período:</strong> {{ formatarData(fechamentoSelecionado.dataInicio) }} a {{ formatarData(fechamentoSelecionado.dataFim) }}
          </div>

          <div class="ofs-list">
            <h3>Ordens de Produção do Período</h3>
            <div 
              v-for="of in fechamentoSelecionado.ofs" 
              :key="of.id" 
              class="of-item"
            >
              <div class="of-header">
                <strong>OF: {{ of.of }}</strong>
                <span>{{ formatarData(of.data) }}</span>
              </div>
              <div class="of-info">
                <span>Qtd: {{ of.quantidadeTotal }}</span>
                <span>Valor: R$ {{ of.valorTotal.toFixed(2) }}</span>
              </div>
              <div class="of-responsaveis">
                <span v-for="resp in of.responsaveis" :key="resp.nome" class="resp-tag">
                  {{ resp.nome }} ({{ resp.quantidade }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const fechamentos = ref([]);
const fechamentoSelecionado = ref(null);

onMounted(() => {
  carregarFechamentos();
});

function carregarFechamentos() {
  const dados = localStorage.getItem("fechamentos-mensais");
  if (dados) {
    fechamentos.value = JSON.parse(dados);
  }
}

function formatarMesAno(mesString) {
  const [ano, mes] = mesString.split('-');
  const data = new Date(ano, mes - 1);
  return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
}

function verDetalhes(fechamento) {
  fechamentoSelecionado.value = fechamento;
}

function fecharModal() {
  fechamentoSelecionado.value = null;
}
</script>

<style scoped>
.fechamentos-list {
  display: grid;
  gap: 15px;
  margin-top: 20px;
}

.fechamento-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fechamento-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.fechamento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.fechamento-header h3 {
  margin: 0;
  color: #1d3557;
}

.periodo {
  color: #666;
  font-size: 0.9em;
}

.fechamento-resumo {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.resumo-item {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.responsaveis-resumo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.resp-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.resp-nome {
  font-weight: bold;
  color: #1d3557;
}

.resp-valor {
  color: #666;
  font-size: 0.9em;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  color: #1d3557;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.periodo-info {
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.ofs-list h3 {
  margin-bottom: 15px;
  color: #1d3557;
}

.of-item {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;
  background: #fafafa;
}

.of-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.of-info {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #666;
}

.of-responsaveis {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.resp-tag {
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: #495057;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
}
</style>