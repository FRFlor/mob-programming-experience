<template>
    <div class="station-chain">
        <div class="chart">
            {{simulatedCycles}}
            <production-chart :x="x" :y="y"/>
        </div>

        <vue-slider height="2px"
                    width="1000px"
                    tooltip-formatter="Scale: {value}%"
                    tooltip-placement="right"
                    v-model="scale"/>

        <div class="grid">
            <div class="station-wrapper" @contextmenu.prevent="openContextForStation($event, i)"
                 v-for="(_, i) in productionLine.workStations"
                 :style="{'grid-area': `station-${i}`}">
                <workstation-view :id="i"
                                  @drag-drop="onDragDrop"
                                  :workstation="productionLine.workStations[i]"
                                  :flow-direction="getFlowDirectionOfStation(i)"/>
            </div>

            <div class="control-center" :style="{'grid-area': `controls`}">
                <div class="days-of-operation">
                    <h2>Days of Operation</h2>
                    <div class="value">{{productionLine.days}}</div>
                </div>
                <div class="animation-duration-slider">
                    <label for="animation_duration_slider">Animation Duration</label>
                    <vue-slider direction="btt"
                                id="animation_duration_slider"
                                height="80px"
                                width="10px"
                                :max="2"
                                :interval="0.1"
                                :min="0"
                                tooltip-formatter="Animation Duration: x{value}"
                                tooltip-placement="right"
                                v-model="animationMultiplier"/>
                </div>
                <div class="d-flex flex-column">
                    <div class="d-flex">
                        <button @click="doSingleWorkCycle" :disabled="isBusy">Work!</button>
                        <button @click="fastForwardCycles(10)" :disabled="isBusy">Work 10 days!</button>
                        <button @click="productionLine.restart()" :disabled="isBusy">Restart</button>
                    </div>

                    <div class="d-flex">
                        <button @click="runSimulation">Chart</button>
                    </div>
                </div>

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
    import ProductionChart from '@/components/ProductionChart.vue';

    @Component({components: {ProductionChart, WorkstationView, VueContext}})
    export default class ProductionLineView extends Vue {
        protected contextStation: number = 0;
        protected isBusy: boolean = false;
        protected scale: number = 100;
        protected animationMultiplier: number = 1;
        protected productionLine: ProductionLine = new ProductionLine(new DiceFactory);
        protected simulatedCycles: number = 0;
        protected x: number[] = [];
        protected y: number[] = [];

        @Watch('animationMultiplier')
        protected onAnimationMultiplierChanged(): void {
            this.productionLine.setWaitMultiplier(this.animationMultiplier);
        }

        @Watch('scale')
        protected onScaleChanged(): void {
            document.documentElement.style.setProperty('--scale', `${this.scale / 100}`);
        }

        protected async doSingleWorkCycle(): Promise<void> {
            this.isBusy = true;
            await this.productionLine.work();
            this.isBusy = false;
        }

        protected async fastForwardCycles(numberOfDays: number): Promise<void> {
            this.isBusy = true;
            for (let i = 0; i < numberOfDays; i++) {
                await this.productionLine.work();
            }
            this.isBusy = false;
        }

        protected getFlowDirectionOfStation(stationId: number): FlowDirection {
            if ([0, 1, 2, 3,].includes(stationId)) {
                return FlowDirection.LeftToRight;
            }

            if ([4, 5].includes(stationId)) {
                return FlowDirection.TopToBottom;
            }

            return FlowDirection.RightToLeft;
        }

        protected onDragDrop({sourceId, destinationId}: any): void {
            this.productionLine.moveWorker(sourceId, destinationId);
        }

        protected openContextForStation(event: any, stationId: number): void {
            this.contextStation = stationId;
            // @ts-ignore;
            return this.$refs.menu.open(event);
        }

        protected moveAllWorkersToContextStation() {
            this.productionLine.moveAllWorkersTo(this.contextStation);
        }

        protected async runSimulation() {
            const simulation: ProductionLine = new ProductionLine(new DiceFactory);
            simulation.setWaitMultiplier(0);

            this.x = Array.from({length: 100}, (_, i) => i);
            const countTotals: number[] = Array.from({length: 100}, (_) => 0);

            const normalizeChart = (countTotals: number[]) => {
                const normalizedChart: number[] = [];
                normalizedChart[0] = this.simulatedCycles;

                for (let i = 1; i < countTotals.length; i++) {
                    normalizedChart[i] = normalizedChart[i-1] - countTotals[i-1];
                }

                return normalizedChart.map((point) => point/this.simulatedCycles * 100);
            };

            for (let j = 0; j < 1000; j++) {
                for (let i = 0; i < 20; i++) {
                    await simulation.work();
                }
                const totalProduced = simulation.totalProduced;
                countTotals[totalProduced]++;
                this.simulatedCycles++;
                simulation.restart();
            }

            this.y = normalizeChart(countTotals);


        }
    }
</script>

<style lang="scss" scoped>
    .chart {
        max-width: 1000px;
    }

    .d-flex {
        display: flex;
    }

    .flex-column {
        flex-direction: column;
    }

    .justify-around {
        justify-content: space-around;
    }

    .days-of-operation, .animation-duration-slider {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        background-color: hsl(203, 60%, 85%);
        border: hsl(203, 40%, 30%) solid 1px;
        height: 8rem;
        padding: 0.5rem;

        .value {
            font-size: 2rem;
        }

        h2 {
            font-size: 1rem;
            margin: 0;
        }

        label {
            font-size: 0.75rem;
            width: 5rem;
            text-align: center;
        }
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(5, 200px);
        width: 200px*5;
        border: hsl(203, 40%, 30%) 4px solid;
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
