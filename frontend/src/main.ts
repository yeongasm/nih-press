import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from '~pages'
import App from './App.vue'
import 'uno.css'

const routes = setupLayouts(pages);
const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app')
