<template>
    <div class="simulation-charter">
        <div class="chart">
            <production-chart :title="chartTitle"
                              :x="totalProduced"
                              :y="oddsOfProducing"
                              :select-x-value="amountPlayerProduced"/>
            <button v-ripple :disabled="daysPerCycle === 0" @click="runSimulation">Start Simulation</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import PreLoaded20 from '../simulations/unmanaged-20days';
    import {ProductionLine} from '@/classes/ProductionLine';
    import {DiceFactory} from '@/classes/DiceFactory';
    import ProductionChart from '@/components/ProductionChart.vue';
    @Component({
        components: {ProductionChart}
    })
    export default class SimulationCharter extends Vue {
        @Prop({default: 20}) daysPerCycle!: number;
        @Prop({default: undefined}) amountPlayerProduced?: number;

        protected simulatedCycles: number = 0;
        protected chartTitle: string = 'Production odds for stations without management (Pre-loaded: 1000 cycles)';

        protected totalProduced: number[] = PreLoaded20.x;
        protected oddsOfProducing: number[] = PreLoaded20.y;
        protected countTotals: number[] = [];

        protected recalculateNormalizedChart(): void {
            const normalizedChart: number[] = [];
            normalizedChart[0] = this.simulatedCycles;

            for (let i = 1; i < this.countTotals.length; i++) {
                normalizedChart[i] = normalizedChart[i - 1] - this.countTotals[i];
            }

            this.chartTitle = `Production odds for stations operating for ${this.daysPerCycle} days without management`;
            this.chartTitle += ` (${this.simulatedCycles} cycles)`;
            // x axis
            this.totalProduced = Array.from({length: this.countTotals.length}, (_, i) => i);
            // y axis
            this.oddsOfProducing = normalizedChart.map((point) => Math.round(point / this.simulatedCycles * 100));
        }

        protected async runSimulation() {
            if (this.simulatedCycles === 0) {
                this.countTotals = Array.from({length: 100}, (_) => 0);
            }

            const simulation: ProductionLine = new ProductionLine(new DiceFactory());
            simulation.setWaitMultiplier(0);

            for (let j = 0; j < 50; j++) {
                for (let i = 0; i < this.daysPerCycle; i++) {
                    await simulation.work();
                }
                this.countTotals[simulation.totalProduced]++;
                this.simulatedCycles++;
                simulation.restart();
                if ((j+1) % 10 === 0) {
                    this.recalculateNormalizedChart();
                }
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
