import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/diagram',
    name: 'Diagram',
    component: () => import(/* webpackChunkName: "diagram" */ '../views/Diagram.vue')
  },
  {
    path: '/icon',
    name: 'Icon',
    component: () => import(/* webpackChunkName: "icon" */ '../views/Icon.vue')
  },
  {
    path: '/shader',
    name: 'Shader',
    component: () => import(/* webpackChunkName: "shader" */ '../views/Shader.vue'),
  },
  {
    path: '/subShader/:id',
    name: 'subShader',
    component: () => import(/* webpackChunkName: "subShader" */ '../components/subShader.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
