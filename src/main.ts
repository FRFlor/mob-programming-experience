import Vue from 'vue';
import App from './App.vue';
import VueDragDrop from 'vue-drag-drop';

Vue.use(VueDragDrop);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
