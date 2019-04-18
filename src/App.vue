<template>
    <div id="app">
        <grid-handler/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GridHandler from '@/components/GridHandler.vue';

@Component({
  components: {
      GridHandler,
  },
})
export default class App extends Vue {
    protected draggable: string = 'hey';

    protected handleDrop(data: any, event: any): void {
        alert(`You dropped with data: ${JSON.stringify(data)}`);
    }
}
</script>

<style lang="scss">
</style>
