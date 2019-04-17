<template>
    <div class="grid-handler">
        <div class="grid">
            <grid-cell v-for="(cell, index) in cells"
                       :key="index"
                       :id="index"
                       :content="cell.content"
                       :active="cell.isActive"/>
        </div>
    </div>
</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import GridCell, {CellContent} from '@/components/GridCell.vue';

    interface Coordinate {
        row: number;
        column: number;
    }

    interface CellData {
        content: CellContent;
        isActive: boolean;
    }

    @Component({ components: {GridCell} })
    export default class GridHandler extends Vue {
        protected columns: number = 10;
        protected rows: number = 7;
        protected cells: CellData[] = [];

        private created(): void {
            this.generateEmptyGrid();
            this.populateGridWithStations();
            this.populateGridWithWorkers();

            document.documentElement.style.setProperty('--column-count', `${this.columns}`);
        }

        private generateEmptyGrid(): void {
            this.cells = Array.from({length: this.columns * this.rows}, (_: any) => {
                return {
                    isActive: false,
                    content: CellContent.Nothing,
                };
            });
        }

        private populateGridWithStations(): void {
            const stationsPositions: Coordinate[] = [
                {row: 0, column: 1}, {row: 0, column: 3}, {row: 0, column: 5}, {row: 0, column: 7},
                {row: 2, column: 8},
                {row: 4, column: 8},
                {row: 6, column: 1}, {row: 6, column: 3}, {row: 6, column: 5}, {row: 6, column: 7},
            ];

            stationsPositions.forEach((position: Coordinate) => {
                Vue.set(this.cells[position.row * this.columns + position.column], 'content', CellContent.Station);
            }, this);
        }

        private populateGridWithWorkers(): void {
            const workersPositions: Coordinate[] = [
                {row: 1, column: 1}, {row: 1, column: 3}, {row: 1, column: 5}, {row: 1, column: 7},
                {row: 2, column: 9},
                {row: 4, column: 9},
                {row: 5, column: 1}, {row: 5, column: 3}, {row: 5, column: 5}, {row: 5, column: 7},
            ];

            workersPositions.forEach((position: Coordinate) => {
                Vue.set(this.cells[position.row * this.columns + position.column], 'content', CellContent.Worker);
                Vue.set(this.cells[position.row * this.columns + position.column], 'isActive', true);
            }, this);
        }
    }
</script>

<style lang="scss" scoped>
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--column-count), 50px);
    }
</style>
