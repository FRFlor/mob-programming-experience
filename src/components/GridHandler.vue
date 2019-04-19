<template>
    <div class="grid-handler">
        <div class="grid">
            <!-- Top Stations -->
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, i)" v-for="i in [0, 1, 2, 3]">
                <work-station :id="i" @drag-drop="onDragDrop"
                              :number-of-workers="workstationWorkers[i]"
                              @decrement-input="$set(workstationInputs, i, workstationInputs[i] - 1)"
                              @increment-output="$set(workstationOutputs, i, workstationOutputs[i] + 1)"
                              :output="workstationOutputs[i]"
                              :input="workstationInputs[i]"/>
            </div>

            <div class="empty-cell">
                <button @click="workTheDay">Work!</button>
            </div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>


            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, 4)">
                <work-station :id="4" @drag-drop="onDragDrop"
                              :number-of-workers="workstationWorkers[4]"
                              @decrement-input="$set(workstationInputs, 4, workstationInputs[4] - 1)"
                              @increment-output="$set(workstationOutputs, 4, workstationOutputs[4] + 1)"
                              :output="workstationOutputs[4]"
                              :input="workstationInputs[4]"/>
            </div>

            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, 5)">
                <work-station :id="5" @drag-drop="onDragDrop"
                              :number-of-workers="workstationWorkers[5]"
                              @decrement-input="$set(workstationInputs, 5, workstationInputs[5] - 1)"
                              @increment-output="$set(workstationOutputs, 5, workstationOutputs[5] + 1)"
                              :output="workstationOutputs[5]"
                              :input="workstationInputs[5]"/>
            </div>

            <!-- Bottom Stations -->
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, i)" v-for="i in [9, 8, 7, 6]">
                <work-station :id="i" @drag-drop="onDragDrop"
                              :number-of-workers="workstationWorkers[i]"
                              @decrement-input="$set(workstationInputs, i, workstationInputs[i] - 1)"
                              @increment-output="$set(workstationOutputs, i, workstationOutputs[i] + 1)"
                              :output="workstationOutputs[i]"
                              :input="workstationInputs[i]"/>
            </div>
        </div>

        <vue-context ref="menu">
            <ul class="context-menu">
                <li @click="moveAllWorkersToContextStation">Move all workers</li>
            </ul>
        </vue-context>
    </div>
</template>


<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import WorkStation from '@/components/WorkStation.vue';
    import { VueContext } from 'vue-context';

    @Component({components: {WorkStation, VueContext}})
    export default class GridHandler extends Vue {
        protected columns: number = 4;
        protected contextStation: number = 0;
        protected numberOfWorkstations: number = 10;
        protected workstationWorkers: number[] = [];
        protected workstationInputs: number[] = [];
        protected workstationOutputs: number[] = [];
        protected scale: number = 100;

        protected created(): void {
            this.workstationWorkers = Array.from({length: this.numberOfWorkstations}, (_: any) => 1);
            this.workstationInputs = Array.from({length: this.numberOfWorkstations}, (_: any) => 5);
            this.workstationInputs[0] = Infinity;
            this.workstationOutputs = Array.from({length: this.numberOfWorkstations}, (_: any) => 0);
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

        protected openContextForStation(event: any, stationId: number): void {
            this.contextStation = stationId;
            // @ts-ignore;
            return this.$refs.menu.open(event);
        }

        protected moveAllWorkersToContextStation() {
            this.workstationWorkers = Array.from({length: this.numberOfWorkstations}, (_: any) => 0);
            Vue.set(this.workstationWorkers, this.contextStation, this.numberOfWorkstations);
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

        .station-wrapper {
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
