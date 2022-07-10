import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faFile, faFlask, faBook } from '@fortawesome/free-solid-svg-icons';
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select';
import pages from '~pages'
import App from './App.vue'
import 'uno.css'

const routes = setupLayouts(pages);
const router = createRouter({
    history: createWebHistory(),
    routes
});

library.add(
  faUser, faFile, faFlask, faBook
);

import { hasAccess, logOut, refreshAccess } from '@/store/user.store';

router.beforeEach(async (to, from) => {
  if (to.matched.some(route => route.meta?.requiresAuth)) {
    const access = await hasAccess();
    if (!access) {
      // NOTE:
      // If we have no access, check that our session is valid and request for new access.
      // If that fails, we now that our session timed out.
      if (!await refreshAccess()) {
        logOut();
        return { path: "/login" };
      }
    }
  }
});

createApp(App)
  .component('v-select', vSelect)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(createPinia())
  .use(router)
  .mount('#app')
