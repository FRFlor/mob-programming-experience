<template>
    <div class="grid-handler">
        <div class="grid">
            <!-- Top Stations -->
            <work-station class="station" :id="0" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[0]"
                          @decrement-input="$set(workstationInputs, 0, workstationInputs[0] - 1)"
                          @increment-output="$set(workstationOutputs, 0, workstationOutputs[0] + 1)"
                          :output="workstationOutputs[0]"
                          :input="workstationInputs[0]"/>
            <work-station class="station" :id="1" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[1]"
                          @decrement-input="$set(workstationInputs, 1, workstationInputs[1] - 1)"
                          @increment-output="$set(workstationOutputs, 1, workstationOutputs[1] + 1)"
                          :output="workstationOutputs[1]"
                          :input="workstationInputs[1]"/>
            <work-station class="station" :id="2" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[2]"
                          @decrement-input="$set(workstationInputs, 2, workstationInputs[2] - 1)"
                          @increment-output="$set(workstationOutputs, 2, workstationOutputs[2] + 1)"
                          :output="workstationOutputs[2]"
                          :input="workstationInputs[2]"/>
            <work-station class="station" :id="3" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[3]"
                          @decrement-input="$set(workstationInputs, 3, workstationInputs[3] - 1)"
                          @increment-output="$set(workstationOutputs, 3, workstationOutputs[3] + 1)"
                          :output="workstationOutputs[3]"
                          :input="workstationInputs[3]"/>

            <div class="empty-cell">
                <button @click="workTheDay">Work!</button>
            </div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <work-station class="station" :id="4" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[4]"
                          @decrement-input="$set(workstationInputs, 4, workstationInputs[4] - 1)"
                          @increment-output="$set(workstationOutputs, 4, workstationOutputs[4] + 1)"
                          :output="workstationOutputs[4]"
                          :input="workstationInputs[4]"/>

            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <div class="empty-cell"></div>
            <work-station class="station" :id="5" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[5]"
                          @decrement-input="$set(workstationInputs, 5, workstationInputs[5] - 1)"
                          @increment-output="$set(workstationOutputs, 5, workstationOutputs[5] + 1)"
                          :output="workstationOutputs[5]"
                          :input="workstationInputs[5]"/>

            <!-- Bottom Stations -->
            <work-station class="station" :id="9" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[9]"
                          @decrement-input="$set(workstationInputs, 9, workstationInputs[9] - 1)"
                          @increment-output="$set(workstationOutputs, 9, workstationOutputs[9] + 1)"
                          :output="workstationOutputs[9]"
                          :input="workstationInputs[9]"/>
            <work-station class="station" :id="8" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[8]"
                          @decrement-input="$set(workstationInputs, 8, workstationInputs[8] - 1)"
                          @increment-output="$set(workstationOutputs, 8, workstationOutputs[8] + 1)"
                          :output="workstationOutputs[8]"
                          :input="workstationInputs[8]"/>
            <work-station class="station" :id="7" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[7]"
                          @decrement-input="$set(workstationInputs, 7, workstationInputs[7] - 1)"
                          @increment-output="$set(workstationOutputs, 7, workstationOutputs[7] + 1)"
                          :output="workstationOutputs[7]"
                          :input="workstationInputs[7]"/>
            <work-station class="station" :id="6" @drag-drop="onDragDrop"
                          :number-of-workers="workstationWorkers[6]"
                          @decrement-input="$set(workstationInputs, 6, workstationInputs[6] - 1)"
                          @increment-output="$set(workstationOutputs, 6, workstationOutputs[6] + 1)"
                          :output="workstationOutputs[6]"
                          :input="workstationInputs[6]"/>
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
