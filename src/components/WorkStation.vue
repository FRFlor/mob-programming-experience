<template>
    <div class="work-station">
        <!-- To force the eager load of the png -->
        <!-- Otherwise the very first drag action will have no icon -->
        <img v-show="false"
             :src="require('../assets/mini-man.png')"
             aria-hidden="true"
             alt="pre-loading of the drag-icon">
        <div class="station-header">
            <div class="input">
                <h2>Input</h2>
                <div class="value" v-if="input === Infinity">∞</div>
                <div class="value" v-else>{{input}}</div>
            </div>

            <div class="station-title">
                <h2>Station {{id + 1}}</h2>
                <div class="station-avatar">
                    <img class="computer-image"
                         src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg"
                         alt="Computer">
                    <div class="effort-badge" v-text="remainingEffort" v-show="totalEffortProduced > 0">
                    </div>
                </div>
            </div>

            <div class="output">
                <h2>Output</h2>
                <div class="value">{{output}}</div>
            </div>
        </div>

        <drop class="workers-area drop-area"
              :class="{'dragging-over' : isDraggingOver}"
              @dragover="isDraggingOver = true"
              @dragleave="isDraggingOver = false"
              @drop="handleDrop">
            <drag class="drag-area"
                  :transfer-data="{ sourceId: id }"
                  :image="require('../assets/mini-man.png')">
                <div class="workers">
                    <div class="worker-avatar">
                        <img v-if="numberOfWorkers === 1"
                             src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/man-user.svg"
                             alt="single worker">
                        <img v-else-if="numberOfWorkers > 1"
                             src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/multiple-users.svg"
                             alt="multiple workers">
                        <div class="count-badge" v-if="numberOfWorkers > 1" v-text="numberOfWorkers"></div>
                    </div>
                    <div class="dice-container">
                        <dice-roll class="dice"
                                   v-for="(_, index) in numberOfWorkers"
                                   :ref="`station-${id}-dice-${index}`"
                                   v-model="diceValues[index]"
                                   @animated-roll-finished="onRollFinished"
                                   :key="index"/>
                    </div>
                </div>
            </drag>
        </drop>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import DiceRoll from '@/components/DiceRoll.vue';
    @Component({ components: {DiceRoll} })
    export default class WorkStation extends Vue {
        @Prop() protected id!: number;
        @Prop() protected numberOfWorkers!: number;
        @Prop({default: 0}) protected input!: number;
        @Prop({default: 0}) protected output!: number;


        protected diceValues: number[] = [];

        protected isDraggingOver: boolean = false;
        protected isProcessingEffort: boolean = false;
        protected remainingEffort: number = 0;

        protected onRollFinished(): void {
            if (this.isProcessingEffort) {
                return;
            }

            this.isProcessingEffort = true;
            setTimeout(() => {
                this.remainingEffort = this.totalEffortProduced;
               this.processEffort();
            }, 350);
        }

        protected processEffort(): void {
            if (this.remainingEffort === 0 || this.input === 0) {
                this.isProcessingEffort = false;
                return;
            }

            this.remainingEffort--;
            this.$emit('decrement-input');
            this.$emit('increment-output');
            setTimeout(() => {
                this.processEffort();
            }, 500);
        }

        public work(): void {

        }

        @Watch('totalEffortProduced')
        protected updateEffort(): void {
            this.remainingEffort = this.totalEffortProduced;
        }

        protected get totalEffortProduced(): number {
            return this.diceValues.reduce( (prev: number, currentValue: number) => currentValue + prev, 0);
        }

        protected rollDice(): void {
            if (this.getDice().length === 0) {
                return;
            }

            this.getDice().forEach( (die:any) => die.roll());
        }

        private  getDice(): any[] {
            return Object.values(this.$refs).map( (wrapper: any) => wrapper[0]).filter( _ => _);
        }

        @Watch('numberOfWorkers')
        private resetDiceValues() {
            this.diceValues = [];
        }

        protected handleDrop(payload: any): void {
            this.isDraggingOver = false;
            if (!payload) {
                return;
            }

            this.$emit('drag-drop', {
                sourceId: payload.sourceId,
                destinationId: this.id,
            });
        }
    }
</script>

<style lang="scss" scoped>
    .drag-area, .drop-area {
        width: 100%;
        height: 100%;
    }

    .work-station {
        height: 100%;
        width: 200px;
        display: flex;

        h2 {
            font-size: 0.75rem;
            margin: 0;
        }

        flex-direction: column;
        align-items: center;
        outline: hsl(0, 0%, 20%) 1px solid;

        .station-header {
            .station-title {
                flex: 1;
                text-align: center;

                img {
                    height: 30px;
                    width: 30px;
                }
            }
            display: flex;
            height: 50px;
            width: 100%;
            align-items: center;
            justify-content: center;
            background-color: hsl(100, 92%, 90%);

            .station-avatar {
                position: relative;

                .effort-badge {
                    position: absolute;
                    height: 14px;
                    width: 22px;
                    background-color: rgba(51, 51, 204, 0.77);
                    color: hsl(0, 0%, 80%);
                    bottom: 14.1px;
                    right: 39.3px;
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

        }

        .workers-area {
            background-color: hsl(203, 92%, 90%);
            outline: hsl(0, 0%, 20%) 1px solid;
            height: 150px;
            width: 100%;

            :hover {
                cursor: pointer;
                background-color: hsl(203, 92%, 70%);
            }

            &.dragging-over {
                background-color: hsl(203, 50%, 40%);
            }

            .worker-avatar {
                position: relative;
                height: 50px;
                width: 50px;
                padding-top: 5px;
                margin: 0 auto;

                img {
                    height: 100%;
                }

                .count-badge {
                    position: absolute;
                    height: 20px;
                    width: 20px;
                    background-color: hsl(240, 60%, 50%);
                    color: hsl(0, 0%, 80%);
                    border: 1px solid hsl(0, 0%, 80%);
                    bottom: -3px;
                    right: -3px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .dice-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                .dice {
                    width: 30px;
                    height: 30px;
                    margin: 3px;
                }
            }
        }

        .input, .output {
            text-align: center;
            background-color: hsl(39, 100%, 85%);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 50px;
            min-height: 50px;
            outline: hsl(0, 0%, 20%) 1px solid;
            .value {
                margin-bottom: 0.5rem;
                font-size: 1.25rem;
            }
        }
    }

</style>
