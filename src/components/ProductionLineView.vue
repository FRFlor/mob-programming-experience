<template>
    <div class="production-line">
        <modal name="chart-modal" width="1000" height="auto" draggable>
            <simulation-charter
                    :days-per-cycle="productionLine.days"
                    :amount-player-produced="productionLine.totalProduced"/>
        </modal>

        <vue-context ref="menu">
            <ul class="context-menu">
                <li @click="moveAllWorkersToContextStation">Move all workers</li>
            </ul>
        </vue-context>

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
                                :max="1"
                                :interval="0.25"
                                :min="0"
                                tooltip-formatter="Animation Duration: x{value}"
                                tooltip-placement="right"
                                v-model="animationMultiplier"/>
                </div>
                <div class="d-flex flex-column">
                    <div class="control-header"> Manual Management </div>
                    <div class="d-flex">
                        <button v-ripple @click="work(1)" :disabled="isBusy">Work for 1 day</button>
                        <button v-ripple @click="work(5)" :disabled="isBusy">Work for 5 days!</button>
                        <button v-ripple @click="productionLine.restart()" :disabled="isBusy">Restart</button>
                    </div>

                    <div class="control-header"> Automated Workflow </div>
                    <div class="d-flex">
                        <button v-ripple @click="demonstrateMobbing" :disabled="isBusy">Automatic Mob</button>
                        <button v-ripple @click="demonstrateSolo" :disabled="isBusy">Automatic Solo</button>
                    </div>

                    <div class="control-header"> Statistics </div>

                    <div class="d-flex">
                        <button class="statistics-trigger"
                                @click="showStatisticsChart"
                                :disabled="productionLine.days === 0 || isBusy"
                                v-ripple >
                            Show statistics<br/>(Your management vs No Management)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import WorkstationView, {FlowDirection} from '@/components/WorkstationView.vue';
    import {VueContext} from 'vue-context';
    import {ProductionLine} from '@/classes/ProductionLine';
    import {DiceFactory} from '@/classes/DiceFactory';
    import SimulationCharter from '@/components/SimulationCharter.vue';

    @Component({components: {SimulationCharter, WorkstationView, VueContext}})
    export default class ProductionLineView extends Vue {
        protected contextStation: number = 0;
        protected isBusy: boolean = false;
        protected scale: number = 100;
        protected animationMultiplier: number = 0.5;
        protected productionLine: ProductionLine = new ProductionLine(new DiceFactory());

        @Watch('animationMultiplier')
        protected onAnimationMultiplierChanged(): void {
            this.productionLine.setWaitMultiplier(this.animationMultiplier);
        }

        @Watch('scale')
        protected onScaleChanged(): void {
            document.documentElement.style.setProperty('--scale', `${this.scale / 100}`);
        }

        protected async work(numberOfDays: number = 1): Promise<void> {
            this.isBusy = true;
            for (let i = 0; i < numberOfDays; i++) {
                await this.productionLine.work();
            }
            this.isBusy = false;
        }

        protected async demonstrateSolo(): Promise<void> {
            const NUMBER_OF_DAYS: number = 20;

            this.productionLine.restart();
            await this.speedUpCallback(async () => {
                await this.work(NUMBER_OF_DAYS);
            });
            this.showStatisticsChart();
        }

        protected showStatisticsChart(): void {
            this.$modal.show('chart-modal');
        }

        protected async demonstrateMobbing(): Promise<void> {
            await this.speedUpCallback(async () => {
                this.isBusy = true;
                await this.productionLine.mob();
                this.isBusy = false;
            });
            this.showStatisticsChart();
        }

        protected async speedUpCallback(callback: any): Promise<void> {
            const originalAnimationMultiplier: number = this.animationMultiplier;
            if (this.animationMultiplier > 0.1) {
                this.animationMultiplier = 0.1;
            }

            await callback();

            this.animationMultiplier = originalAnimationMultiplier;
        }

        protected getFlowDirectionOfStation(stationId: number): FlowDirection {
            if ([0, 1, 2, 3].includes(stationId)) {
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

        private created(): void {
            this.productionLine.setWaitMultiplier(this.animationMultiplier);
        }
    }
</script>

<style lang="scss" scoped>

    .control-header {
        font-size: 0.75rem;
        width: 100%;
        text-align: center;
        margin: 0.5rem;
        &:first-of-type {
            margin-top: 0;
        }
    }

    button {
        margin: 0.15rem;
        height: 2rem;
        min-width: 8rem;
        background-color: aliceblue;
        outline: none;

        &:hover {
            cursor: pointer;
            &[disabled] {
                cursor: not-allowed;
            }
        }

        &.statistics-trigger {
            flex: 1;
            height: 4rem;
        }
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

    .align-center {
        align-items: center;
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
        }
    }
</style>
