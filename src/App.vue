<template>
    <div id="app">
        <production-line-view/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductionLineView from '@/components/ProductionLineView.vue';

@Component({
  components: {
      ProductionLineView,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
</style>
