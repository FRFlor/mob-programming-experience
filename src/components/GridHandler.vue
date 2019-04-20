<template>
    <div class="grid-handler">
        <div v-if="ready" class="grid">
            <!-- Top Stations -->
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, i)" v-for="i in [0, 1, 2, 3]">
                <work-station :id="i"
                              @drag-drop="onDragDrop"
                              :workstation-class="stationChain.workStations[i]"/>
            </div>

            <div class="empty-cell">
                <button @click="stationChain.work()">Work!</button>
            </div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>


            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, 4)">
                <work-station :id="4"
                              @drag-drop="onDragDrop"
                              :workstation-class="stationChain.workStations[4]"/>
            </div>

            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, 5)">
                <work-station :id="5"
                              @drag-drop="onDragDrop"
                              :workstation-class="stationChain.workStations[5]"/>
            </div>

            <!-- Bottom Stations -->
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, i)" v-for="i in [9, 8, 7, 6]">
                <work-station :id="i"
                              @drag-drop="onDragDrop"
                              :workstation-class="stationChain.workStations[i]"/>
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
    import {StationChain} from '@/classes/StationChain';
    import {WorkStation as WorkStationClass} from '@/classes/WorkStation';
    import {DiceFactory} from '@/classes/DiceFactory';

    @Component({components: {WorkStation, VueContext}})
    export default class GridHandler extends Vue {
        protected columns: number = 4;
        protected contextStation: number = 0;
        protected scale: number = 100;
        protected stationChain: StationChain = new StationChain(new DiceFactory());
        protected ready = true;

        protected created(): void {
            document.documentElement.style.setProperty('--column-count', `${this.columns}`);
        }

        @Watch('scale')
        protected onScaleChanged(): void {
            document.documentElement.style.setProperty('--scale', `${this.scale / 100}`);
        }

        protected onDragDrop({sourceId, destinationId}: any): void {
            this.stationChain.moveWorker(sourceId, destinationId);
        }

        protected openContextForStation(event: any, stationId: number): void {
            this.contextStation = stationId;
            // @ts-ignore;
            return this.$refs.menu.open(event);
        }

        protected moveAllWorkersToContextStation() {
            this.stationChain.moveAllWorkersTo(this.contextStation);
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
