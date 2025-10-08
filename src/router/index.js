import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import HelloWorldPage from '../views/HelloWorldPage.vue'
import Recursos from '../views/Recursos.vue'
import Solucoes from '../views/Solucoes.vue'
import Login from '../views/Login.vue'           // <-- novo
import RegistreSe from '../views/RegistreSe.vue' // <-- novo
import Marketing from '../views/Marketing.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'HomePage',
    component: Home
  },
  {
    path: '/hello',
    name: 'HelloWorld',
    component: HelloWorldPage
  },
  {
    path: '/recursos',
    name: 'Recursos',
    component: Recursos
  },
  {
    path: '/solucoes',
    name: 'Solucoes',
    component: Solucoes
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/registre-se',
    name: 'RegistreSe',
    component: RegistreSe
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: Marketing
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
