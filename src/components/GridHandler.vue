<template>
    <div class="grid-handler">
        <div class="grid">
            <div class="cell"
                 v-for="i in gridSize**2"
                 :key="i">
                {{i}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';

    @Component
    export default class GridHandler extends Vue {
        protected gridSize: number = 5;

        private created(): void {
            document.documentElement.style.setProperty('--grid-size', `${this.gridSize}`);
        }

        @Watch('gridSize')
        private onGridSizeChanged(): void {
            document.documentElement.style.setProperty('--grid-size', `${this.gridSize}`);
        }
    }
</script>

<style lang="scss" scoped>
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--grid-size), 50px);
    }

    .cell {
        background-color: hsl(203, 92%, 90%);
        outline: hsl(0, 0%, 20%) 1px solid;
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
