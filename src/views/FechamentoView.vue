<template>
  <div>
    <h1>Fechamento Mensal</h1>
    
    <div v-if="ordens.length === 0" class="empty-state">
      <p>Nenhuma ordem de produção cadastrada.</p>
      <router-link to="/app/ordens">
        <button>Criar Primeira OF</button>
      </router-link>
    </div>

    <div v-else>
      <div class="dashboard-header">
        <p>Total de OFs: {{ ordens.length }}</p>
        <button @click="exportarExcel" class="export-btn">
          📊 Exportar Excel
        </button>
        <router-link to="/app/ordens">
          <button>Nova OF</button>
        </router-link>
      </div>

      <div class="ordens-list">
        <div v-for="(ordem, index) in ordens" :key="index" class="ordem-card">
          <div class="ordem-header">
            <h3>OF: {{ ordem.of }}</h3>
            <span class="data">{{ formatarData(ordem.data) }}</span>
          </div>
          
          <div class="ordem-info">
            <p><strong>Quantidade Total:</strong> {{ ordem.quantidadeTotal }}</p>
            <p><strong>Valor Unitário:</strong> R$ {{ ordem.valorUnitario.toFixed(2) }}</p>
            <p><strong>Valor Total:</strong> R$ {{ ordem.valorTotal.toFixed(2) }}</p>
          </div>

          <div class="responsaveis" v-if="ordem.responsaveis && ordem.responsaveis.length > 0">
            <h4>Responsáveis que trabalharam na OF:</h4>
            <ul>
              <li v-for="(resp, respIndex) in ordem.responsaveis" :key="respIndex">
                {{ resp.nome }} - {{ resp.quantidade }} un. (R$ {{ resp.valor.toFixed(2) }})
              </li>
            </ul>
          </div>
          
          <div class="sem-responsaveis" v-else>
            <p><em>Nenhum responsável com quantidade atribuída</em></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as XLSX from "xlsx";

const ordens = ref([]);

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

function exportarExcel() {
  try {
    // Preparar dados para exportação
    const dadosExportacao = [];
    
    ordens.value.forEach(ordem => {
      // Linha principal da OF
      dadosExportacao.push({
        'Data': ordem.data,
        'Número OF': ordem.of,
        'Quantidade Total': ordem.quantidadeTotal,
        'Valor Unitário': ordem.valorUnitario,
        'Valor Total': ordem.valorTotal,
        'Responsável': '-',
        'Quantidade Responsável': '-',
        'Valor Responsável': '-'
      });
      
      // Linhas dos responsáveis (apenas os que trabalharam)
      if (ordem.responsaveis && ordem.responsaveis.length > 0) {
        ordem.responsaveis.forEach(resp => {
          dadosExportacao.push({
            'Data': '',
            'Número OF': '',
            'Quantidade Total': '',
            'Valor Unitário': '',
            'Valor Total': '',
            'Responsável': resp.nome,
            'Quantidade Responsável': resp.quantidade,
            'Valor Responsável': resp.valor
          });
        });
      }
      
      // Linha em branco para separar OFs
      dadosExportacao.push({});
    });

    // Criar planilha
    const worksheet = XLSX.utils.json_to_sheet(dadosExportacao);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ordens de Produção");

    // Gerar arquivo e fazer download
    const nomeArquivo = `ordens_producao_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, nomeArquivo);
    
    console.log('Arquivo Excel exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    alert('Erro ao exportar arquivo Excel. Verifique o console para detalhes.');
  }
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.ordens-list {
  display: grid;
  gap: 15px;
}

.ordem-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ordem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.ordem-info {
  margin-bottom: 10px;
}

.ordem-info p {
  margin: 5px 0;
}

.responsaveis ul {
  margin: 0;
  padding-left: 20px;
}

.responsaveis li {
  margin: 3px 0;
}

.sem-responsaveis {
  color: #666;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
}

button {
  padding: 8px 16px;
  background: #1d3557;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #457b9d;
}

.export-btn {
  background: #2a9d8f;
}

.export-btn:hover {
  background: #21867a;
}

.data {
  color: #666;
  font-size: 0.9em;
}
</style>