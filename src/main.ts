import Vue from 'vue';
import App from './App.vue';
import VueDragDrop from 'vue-drag-drop';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import Ripple from 'vue-ripple-directive';
import vmodal from 'vue-js-modal';

Vue.directive('ripple', Ripple);
Vue.component('VueSlider', VueSlider);
Vue.use(VueDragDrop);
Vue.use(vmodal);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
