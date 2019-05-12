<template>
    <div id="app">
        <production-line-view/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductionLineView from '@/components/ProductionLineView.vue';

@Component({ components: { ProductionLineView } })
export default class App extends Vue {
}
</script>

<style lang="scss">
    body {
        margin: 0;
        background-color: hsla(170, 41%, 26%, 0.5);
        #app {
            display: flex;
            justify-content: center;
            margin: 2rem 0 4rem;
        }
    }
</style>
