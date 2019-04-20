import Vue from 'vue';
import App from './App.vue';
import VueDragDrop from 'vue-drag-drop';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

Vue.component('VueSlider', VueSlider);
Vue.use(VueDragDrop);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
