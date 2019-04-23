<template>
    <div class="simulation-charter">
        <div class="chart">
            <production-chart :title="chartTitle"
                              :x="totalProduced"
                              :y="oddsOfProducing"
                              :select-x-value="amountPlayerProduced"/>
            <button v-ripple
                    @click="runSimulation"
                    v-text="simulatedCycles > 0 ? 'Refine Simulation' : 'Start Simulation'"></button>
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
        protected chartTitle: string = 'Production odds for stations without management (Pre-loaded: 1000 cycles)';

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
            if (this.simulatedCycles === 0) {
                this.countTotals = Array.from({length: 100}, (_) => 0);
            }

            const simulation: ProductionLine = new ProductionLine(new DiceFactory());
            simulation.setWaitMultiplier(0);

            for (let j = 0; j < 25; j++) {
                for (let i = 0; i < this.daysPerCycle; i++) {
                    await simulation.work();
                }
                this.countTotals[simulation.totalProduced]++;
                this.simulatedCycles++;
                simulation.restart();
                this.recalculateNormalizedChart();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chart {
        min-width: 800px;
        max-width: 1000px;
    }
</style>