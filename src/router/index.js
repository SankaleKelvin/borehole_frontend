import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LocationsPage from '@/views/LocationsPage.vue'
import PlotsPage from '@/views/PlotsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about-us',
      name: 'about',      
      component: AboutView
    },
    {
      path: '/locations',
      name: 'LocationsPage',      
      component: LocationsPage
    },
    {
      path: '/plots',
      name: 'PlotsPage',      
      component: PlotsPage
    },
    
  ]
})

export default router