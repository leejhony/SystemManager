import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import OrdensView from '../views/OrdensView.vue'
import FechamentoView from '../views/FechamentoView.vue'
import HistoricoMensalView from '../views/HistoricoMensalView.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Login separado
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },

    // Área autenticada
    {
      path: '/app',
      component: MainLayout,
      children: [
        { path: 'dashboard', component: DashboardView },
        { path: 'ordens', component: OrdensView },        
        { path: 'fechamento', component: FechamentoView },
        { path: 'historico-mensal', component: HistoricoMensalView }, 
      ]
    },
  ]
})

export default router