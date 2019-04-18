import {CellContent} from './GridCell';
<template>
    <div class="grid-handler">
        <div class="grid">
            <grid-cell v-for="(cell, index) in cells"
                       :key="index"
                       :id="index"
                       :content="cell.content"
                       :active="cell.isActive"
                       :content-count="cell.contentCount"
                       @drag-drop="onDragDrop"/>
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
        contentCount: number;
    }

    @Component({components: {GridCell}})
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
                    contentCount: 0,
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
                Vue.set(this.cells[position.row * this.columns + position.column], 'contentCount', 1);
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
                Vue.set(this.cells[position.row * this.columns + position.column], 'contentCount', 1);
                Vue.set(this.cells[position.row * this.columns + position.column], 'isActive', true);
            }, this);
        }

        protected addContentToCell(cellId: number, content: CellContent): void {
            if (content === CellContent.Nothing) {
                return;
            }

            if (this.cells[cellId].content === CellContent.Nothing) {
                Vue.set(this.cells[cellId], 'content', content);
                Vue.set(this.cells[cellId], 'contentCount', 1);

                return;
            }

            if (this.cells[cellId].contentCount > 0 && this.cells[cellId].content !== content) {
                throw new DOMException('Cannot change content of a non-empty cell');
            }

            const a  = this.cells[cellId].contentCount + 1;
            console.log('here' + a);

            Vue.set(this.cells[cellId], 'contentCount', a);
        }

        protected removeContentFromCell(cellId: number): void {
            Vue.set(this.cells[cellId], 'contentCount', this.cells[cellId].contentCount - 1);
            if (this.cells[cellId].contentCount <= 0) {
                Vue.set(this.cells[cellId], 'content', CellContent.Nothing);
                Vue.set(this.cells[cellId], 'contentCount', 0);
            }
        }



        protected onDragDrop({sourceId, destinationId}: any): void {
            this.addContentToCell(destinationId, this.cells[sourceId].content);
            this.removeContentFromCell(sourceId);
        }
    }
</script>

<style lang="scss" scoped>
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--column-count), 50px);
    }
</style>
