<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>SystemManager</h2>

      <nav>
        <ul>
          <li><router-link to="/app/dashboard">Dashboard</router-link></li>
          <li><router-link to="/app/ordens">Ordens de Produção (OF)</router-link></li>          
          <li><router-link to="/app/fechamento">Fechamento</router-link></li>
          <li><router-link to="/app/historico-mensal">Histórico Mensal</router-link></li>
        </ul>
      </nav>
    </aside>

    <!-- Conteúdo -->
    <main class="content">
      <header class="topbar">
        <span>Painel Administrativo</span>
      </header>

      <section class="page-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  min-width: 100vw;
}

.sidebar {
  width: 240px;
  background: #1d3557;
  color: white;
  padding: 20px;
  flex-shrink: 0;
}

.sidebar h2 {
  font-size: 22px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
}

.sidebar a.router-link-active {
  font-weight: bold;
}

.content {
  flex: 1;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  background: #457b9d;
  color: white;
  padding: 12px 20px;
  flex-shrink: 0;
}

.page-content {
  flex: 1;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

:deep(.form) {
  max-width: none !important;
  width: 100% !important;
}

:deep(.dashboard-header) {
  max-width: none !important;
}

:deep(.resumo-mensal) {
  max-width: none !important;
}

:deep(.ordens-list) {
  max-width: none !important;
}
</style>