<template>
    <div class="grid-handler">
        <div class="grid">
            <!--First Row-->
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell/>

            <!--Second Row-->
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell/>

            <!--Third Row-->
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell :content="CellContent.Worker"/>

            <!--Fourth Row-->
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>

            <!--Fifth Row-->
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell :content="CellContent.Worker"/>

            <!--Seventh Row-->
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Worker"/>
            <grid-cell/>
            <grid-cell/>

            <!--Eighth Row-->
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell :content="CellContent.Station"/>
            <grid-cell/>
            <grid-cell/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import GridCell, {CellContent} from '@/components/GridCell.vue';
    @Component({
        components: {GridCell}
    })
    export default class GridHandler extends Vue {
        protected gridSize: number = 10;
        protected isDraggingOver: boolean[] = [];
        protected CellContent = CellContent;

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
</style>
