import Vue from 'vue'
import VueRouter from 'vue-router'
import RecursionFiles from '../views/RecursionFiles'
import FileManager from '../views/FileManager'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'RecursionFiles',
    component: RecursionFiles,
  },
  {
    path: '/file-manager',
    name: 'FileManager',
    component: FileManager
  },
  {
    path: '*',
    redirect: '/',
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
