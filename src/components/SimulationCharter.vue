<template>
    <div class="simulation-charter">
        <div class="chart">
            <production-chart :title="chartTitle"
                              :x="totalProduced"
                              :y="oddsOfProducing"
                              :select-x-value="amountPlayerProduced"/>

            <div class="controls">
                <button v-ripple
                        @click="runSimulation"
                        :disabled="isBusy"
                        v-html="simulationButtonCaption"></button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import PreLoaded20 from '../simulations/unmanaged-20days';
    import {ProductionLine} from '@/classes/ProductionLine';
    import {DiceFactory} from '@/classes/DiceFactory';
    import ProductionChart from '@/components/ProductionChart.vue';

    @Component({components: {ProductionChart}})
    export default class SimulationCharter extends Vue {
        @Prop({default: 20}) protected daysPerCycle!: number;
        @Prop({default: undefined}) protected amountPlayerProduced?: number;

        protected simulatedCycles: number = 0;
        protected cyclesPerRefinementRequest: number = 25;
        protected chartTitle: string = 'Production odds for stations without management (Pre-loaded: 1000 cycles)';

        protected isBusy: boolean = false;
        protected totalProduced: number[] = [];
        protected oddsOfProducing: number[] = [];
        protected countTotals: number[] = [];

        protected created() {
            if (this.daysPerCycle === 20) {
                this.totalProduced = PreLoaded20.x;
                this.oddsOfProducing = PreLoaded20.y;
            } else {
                this.runSimulation();
            }

            this.guaranteePlayerValueWillBeInRange();
        }

        protected recalculateNormalizedChart(): void {
            const normalizedChart: number[] = [];
            normalizedChart[0] = this.simulatedCycles;

            for (let i = 1; i < this.countTotals.length; i++) {
                normalizedChart[i] = normalizedChart[i - 1] - this.countTotals[i - 1];
            }

            this.chartTitle = `Production odds for stations operating for ${this.daysPerCycle} days without management`;
            this.chartTitle += ` (${this.simulatedCycles} cycles)`;
            // x axis
            this.totalProduced = Array.from({length: this.countTotals.length}, (_, i) => i);
            // y axis
            this.oddsOfProducing = normalizedChart.map((point) => Math.round(point / this.simulatedCycles * 100));

            this.guaranteePlayerValueWillBeInRange();
        }

        protected guaranteePlayerValueWillBeInRange(): void {
            if (this.amountPlayerProduced === undefined) {
                return;
            }

            if (this.oddsOfProducing[this.amountPlayerProduced] > 0) {
                return;
            }

            Vue.set(this.oddsOfProducing, this.amountPlayerProduced, 100);
        }

        protected async runSimulation(): Promise<void> {
            this.isBusy = true;
            const simulation: ProductionLine = new ProductionLine(new DiceFactory());
            simulation.setWaitMultiplier(0);

            const perfectProductionSize: number = simulation.workStations[0].maxWorkerEffort * this.daysPerCycle;

            if (this.simulatedCycles === 0) {
                this.countTotals = Array.from({length: perfectProductionSize}, (_) => 0);
            }

            for (let j = 0; j < this.cyclesPerRefinementRequest; j++) {
                for (let i = 0; i < this.daysPerCycle; i++) {
                    await simulation.work();
                }
                this.countTotals[simulation.totalProduced]++;
                this.simulatedCycles++;
                simulation.restart();
                this.recalculateNormalizedChart();
            }

            this.isBusy = false;
        }

        protected get simulationButtonCaption(): string {
            if (this.isBusy) {
                const cyclesRemaining: number = this.cyclesPerRefinementRequest
                    - this.simulatedCycles % this.cyclesPerRefinementRequest;
                return `Please wait </br>( ${cyclesRemaining} cycles remaining )`;
            }

            return this.simulatedCycles > 0
                ? `Refine Simulation </br>( ${this.cyclesPerRefinementRequest} more cycles )`
                : `Start Simulation  </br>( ${this.cyclesPerRefinementRequest} cycles )`;
        }
    }
</script>

<style lang="scss" scoped>
    .chart {
        min-width: 800px;
        max-width: 1000px;
        margin: 10px 30px 10px 5px;
    }

    .controls {
        margin-left: 60px;
        display: flex;
        justify-content: center;

        button {
            height: 4rem;
            width: 15rem;
            margin: 2rem;
            font-size: 1.2rem;

            &:hover {
                cursor: pointer;
            }

            &[disabled] {
                cursor: not-allowed;
            }
        }
    }

</style>
