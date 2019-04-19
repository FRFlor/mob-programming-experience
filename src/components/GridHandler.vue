<template>
    <div class="grid-handler">
        <div class="grid">
            <!-- Top Stations -->
            <work-station class="station" :id="0" :number-of-workers="workstationWorkers[0]" @drag-drop="onDragDrop"/>
            <work-station class="station" :id="1" :number-of-workers="workstationWorkers[1]" @drag-drop="onDragDrop"/>
            <work-station class="station" :id="2" :number-of-workers="workstationWorkers[2]" @drag-drop="onDragDrop"/>
            <work-station class="station" :id="3" :number-of-workers="workstationWorkers[3]" @drag-drop="onDragDrop"/>

            <div class="empty-cell">
                <button @click="workTheDay">Work!</button>
            </div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <work-station class="station" :id="4" :number-of-workers="workstationWorkers[4]" @drag-drop="onDragDrop"/>

            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <work-station class="station" :id="5" :number-of-workers="workstationWorkers[5]" @drag-drop="onDragDrop"/>

            <!-- Bottom Stations -->
            <work-station class="station" :id="9" :number-of-workers="workstationWorkers[9]" @drag-drop="onDragDrop"/>
            <work-station class="station" :id="8" :number-of-workers="workstationWorkers[8]" @drag-drop="onDragDrop"/>
            <work-station class="station" :id="7" :number-of-workers="workstationWorkers[7]" @drag-drop="onDragDrop"/>
            <work-station class="station" :id="6" :number-of-workers="workstationWorkers[6]" @drag-drop="onDragDrop"/>
        </div>
    </div>
</template>


<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import WorkStation from '@/components/WorkStation.vue';

    @Component({components: {WorkStation}})
    export default class GridHandler extends Vue {
        protected columns: number = 4;
        protected numberOfWorkstations: number = 10;
        protected workstationWorkers: number[] = [];
        protected scale: number = 100;

        protected created(): void {
            this.workstationWorkers = Array.from({length: this.numberOfWorkstations}, (_: any) => 1);
            document.documentElement.style.setProperty('--column-count', `${this.columns}`);
        }

        @Watch('scale')
        protected onScaleChanged(): void {
            document.documentElement.style.setProperty('--scale', `${this.scale / 100}`);
        }

        protected onDragDrop({sourceId, destinationId}: any): void {
            if (this.workstationWorkers[sourceId] <= 0) {
                return;
            }

            Vue.set(this.workstationWorkers, sourceId, this.workstationWorkers[sourceId] - 1);
            Vue.set(this.workstationWorkers, destinationId, this.workstationWorkers[destinationId] + 1);
        }

        private get workstations() {
            return this.$children.filter((child) => child.$el.className.includes('work-station'));
        }

        protected workTheDay(): void {
            this.workstations.forEach((workstation: any) => workstation.rollDice());
        }
    }
</script>

<style lang="scss" scoped>
    button {
        z-index: 4;
        background-color: lightseagreen;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--column-count), 200px);
        transform-origin: 0 0;
        transform: scale(var(--scale));

        .station {
            z-index: 2;
        }

        .empty-cell {
            width: 100%;
            height: 100%;
            background-color: hsl(203, 92%, 95%);
            outline: hsl(0, 0%, 80%) 1px solid;
        }
    }
</style>
