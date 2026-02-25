<template>
  <div>
    <h1>Cadastro de Ordem de Produção (OF)</h1>

    <div class="form">

      <!-- Data -->
      <label>Data:</label>
      <input type="date" v-model="data" />

      <!-- OF -->
      <label>Número da OF:</label>
      <input type="text" v-model="of" />

      <!-- Quantidade Total -->
      <label>Quantidade Total:</label>
      <input type="number" v-model.number="quantidadeTotal" />

      <!-- Valor Unitário -->
      <label>Valor Unitário (R$):</label>
      <input 
        type="number" 
        step="0.01" 
        v-model.number="valorUnitario" 
        @focus="handleValorUnitarioFocus"
      />

     <!-- Valor Total (apenas um campo, não editável) -->
      <label>Valor Total (R$):</label>
      <input 
        type="text" 
        :value="valorTotal.toFixed(2)" 
        disabled 
        class="campo-valor-total"
      />

      <hr />

      <!-- Responsáveis -->
      <h3>Responsáveis</h3>

      <div 
        v-for="(resp, index) in responsaveis" 
        :key="index" 
        class="resp-bloco"
      >
        <input 
          v-if="resp.editavel"
          type="text"
          placeholder="Nome"
          v-model="resp.nome"
        />

        <strong v-else>{{ resp.nome }}</strong>

        <label>Qnt:</label>
        <input 
          type="number" 
          v-model.number="resp.quantidade"
          :class="{ erroQtd: resp.quantidade > quantidadeTotal || somaResponsaveis > quantidadeTotal }"
        />

        <span>
          Valor: R$ {{ calcularValorResponsavel(resp.quantidade).toFixed(2) }}
        </span>

        <!-- Botão remover -->
        <button 
          v-if="resp.editavel" 
          @click="removerResponsavel(index)"
        >X</button>
      </div>

      <button @click="addResponsavel">Adicionar mais responsável</button>

      <hr />

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button @click="salvar">Salvar OF</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Campos principais
const data = ref(new Date().toISOString().substring(0, 10));
const of = ref("");
const quantidadeTotal = ref(0);
const valorUnitario = ref(0);

// Responsáveis (fixos + ilimitados adicionais)
const responsaveis = ref([
  { nome: "Jhony", quantidade: 0, editavel: false },
  { nome: "Ana", quantidade: 0, editavel: false },
  { nome: "Helen", quantidade: 0, editavel: false }
]);

function addResponsavel() {
  responsaveis.value.push({
    nome: "",
    quantidade: 0,
    editavel: true
  });
}

function removerResponsavel(index) {
  responsaveis.value.splice(index, 1);
}

// Valor total automático (atualizado em tempo real)
const valorTotal = computed(() => {
  return quantidadeTotal.value * valorUnitario.value;
});

// Soma dos responsáveis (apenas quantidades > 0)
const somaResponsaveis = computed(() =>
  responsaveis.value.reduce((t, r) => t + (r.quantidade > 0 ? r.quantidade : 0), 0)
);

// Calcular valor do responsável em tempo real
function calcularValorResponsavel(quantidade) {
  return quantidade * valorUnitario.value;
}

// Handler para foco no campo valor unitário
function handleValorUnitarioFocus() {
  if (valorUnitario.value === 0) {
    valorUnitario.value = '';
  }
}

const erro = ref("");

function salvar() {
  erro.value = "";

  if (somaResponsaveis.value !== quantidadeTotal.value) {
    erro.value = "A soma das quantidades deve ser igual à quantidade total.";
    return;
  }

  // Filtrar apenas responsáveis com quantidade > 0
  const responsaveisComQuantidade = responsaveis.value.filter(r => r.quantidade > 0);

  const registro = {
    data: data.value,
    of: of.value,
    quantidadeTotal: quantidadeTotal.value,
    valorUnitario: valorUnitario.value,
    valorTotal: valorTotal.value,
    responsaveis: responsaveisComQuantidade.map(r => ({
      nome: r.nome,
      quantidade: r.quantidade,
      valor: calcularValorResponsavel(r.quantidade)
    }))
  };

  const lista = JSON.parse(localStorage.getItem("of-lista") || "[]");
  lista.push(registro);
  localStorage.setItem("of-lista", JSON.stringify(lista));

  router.push("/app/dashboard");
}
</script>

<style scoped>
.form {
  max-width: 500px;
}

.resp-bloco {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.campo-valor-total {
  background: #f1f1f1;
  font-weight: bold;
}

.erro {
  color: red;
  font-weight: bold;
}

.erroQtd {
  border: 2px solid red;
}

button {
  margin-top: 10px;
  padding: 6px 12px;
  background: #1d3557;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #457b9d;
}

input[type="number"] {
  padding: 5px;
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>