<template>
    <div class="station-chain">
        <div class="grid">
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, i)"
                 v-for="(_, i) in stationChain.workStations"
                 :style="{'grid-area': `station-${i}`}">
                <workstation-view :id="i"
                                  @drag-drop="onDragDrop"
                                  :workstation="stationChain.workStations[i]"
                                  :flow-direction="getFlowDirectionOfStation(i)"/>
            </div>

            <div class="control-center" :style="{'grid-area': `controls`}">
                <button @click="stationChain.generateProducts()">Generate Products!</button>
                <button @click="stationChain.moveAllProductsAlong()">Move Products!</button>
                <button @click="stationChain.work()">Work!</button>
                <button @click="stationChain.fastForwardWork(10)">Work 10 days!</button>
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
    import WorkstationView, {FlowDirection} from '@/components/WorkstationView.vue';
    import {VueContext} from 'vue-context';
    import {ProductionLine} from '@/classes/ProductionLine';
    import {DiceFactory} from '@/classes/DiceFactory';

    @Component({components: {WorkstationView, VueContext}})
    export default class ProductionLineView extends Vue {
        protected contextStation: number = 0;
        protected scale: number = 100;
        protected stationChain: ProductionLine = new ProductionLine(new DiceFactory());
        protected FlowDirection = FlowDirection;

        @Watch('scale')
        protected onScaleChanged(): void {
            document.documentElement.style.setProperty('--scale', `${this.scale / 100}`);
        }

        protected getFlowDirectionOfStation(stationId: number): FlowDirection {
            if ([0, 1, 2, 3,].includes(stationId)) {
                return FlowDirection.LeftToRight;
            }

            if([4,5].includes(stationId)) {
                return FlowDirection.TopToBottom;
            }

            return FlowDirection.RightToLeft;
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
    .grid {
        display: grid;
        grid-template-columns: repeat(5, 200px);
        width: 200px*5;
        border:  hsl(203, 40%, 30%) 4px solid;
        background-color: hsl(203, 40%, 50%);
        transform-origin: 0 0;
        transform: scale(var(--scale));
        /*@formatter:off*/
        grid-template-areas:
                'station-0 station-1 station-2 station-3      .'
                'controls  controls  controls  controls   station-4'
                'controls  controls  controls  controls   station-5'
                'station-9 station-8 station-7 station-6      .';
        /*@formatter:on*/

        .station-wrapper {
            z-index: 2;
        }

        .control-center {
            display: flex;
            justify-content: space-around;
            padding-top: 5rem;
            width: 100%;
            height: 100%;
            background-color: hsl(203, 92%, 95%);
            outline: hsl(0, 0%, 80%) 1px solid;
            button {
                height: 2rem;
                width: 8rem;
                background-color: aliceblue;
            }
        }
    }
</style>
