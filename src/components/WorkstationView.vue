<template>
    <div class="work-station">
        <!-- To force the eager load of the png -->
        <!-- Otherwise the very first drag action will have no icon -->
        <img v-show="false"
             :src="require('../assets/mini-man.png')"
             aria-hidden="true"
             alt="pre-loading of the drag-icon">
        <div class="station-header">
            <div class="input" :style="inputColour">
                <h2>Input</h2>
                <div class="value" v-if="workstation.input === Infinity">∞</div>
                <div class="value" v-else>{{workstation.input}}</div>
            </div>

            <div class="station-title">
                <h2>Station {{id + 1}}</h2>
                <div class="station-avatar">
                    <img class="computer-image"
                         src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg"
                         alt="Computer">
                    <div class="effort-badge"
                         v-text="workstation.effortRemaining"
                         v-show="workstation.effortRemaining > 0">
                    </div>
                </div>
            </div>

            <div class="output">
                <h2>Output</h2>
                <div class="value">{{workstation.output}}</div>
            </div>
        </div>

        <drop class="workers-area drop-area"
              @dragover="isDraggingOver = true"
              @dragleave="isDraggingOver = false"
              @drop="handleDrop">
            <drag class="drag-area"
                  :style="backgroundArrow"
                  :class="{'dragging-over' : isDraggingOver}"
                  :transfer-data="{ sourceId: id }"
                  :image="require('../assets/mini-man.png')">
                <div class="workers">
                    <div class="input-balls-container">
                        <div class="ball"
                             :style="inputColour"
                             v-for="i in inputBallsCount"></div>
                    </div>
                    <div class="output-balls-container" v-if="workstation.output">
                        <div class="ball"
                             style="background-color: hsl(240, 34%, 33%);"
                             v-for="i in workstation.output"></div>
                    </div>
                    <div class="worker-avatar">
                        <img v-if="workstation.numberOfWorkers === 1"
                             src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/man-user.svg"
                             alt="single worker">
                        <img v-else-if="workstation.numberOfWorkers > 1"
                             src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/multiple-users.svg"
                             alt="multiple workers">
                        <div class="count-badge"
                             v-if="workstation.numberOfWorkers > 1"
                             v-text="workstation.numberOfWorkers"></div>
                    </div>
                    <div class="dice-container">
                        <dice-view class="dice"
                                   v-for="(dice, index) in workstation.workersDice"
                                   :dice="dice"
                                   :key="index"/>
                    </div>
                </div>
            </drag>
        </drop>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import DiceView from '@/components/DiceView.vue';
    import {WorkStation} from '@/classes/WorkStation';

    export enum FlowDirection {
        LeftToRight = 'left-to-right',
        RightToLeft = 'right-to-left',
        TopToBottom = 'top-to-bottom',
        BottomToTop = 'bottom-to-top',
    }

    @Component({components: {DiceView}})
    export default class WorkstationView extends Vue {
        @Prop() protected id!: number;
        @Prop() protected workstation!: WorkStation;
        @Prop({default: FlowDirection.LeftToRight}) protected flowDirection!: FlowDirection;

        protected isDraggingOver: boolean = false;

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

        protected get backgroundArrow(): string {
            const BASE_URL: string = `https://res.cloudinary.com/felipeflor/image/upload`;
            const ANGLE: number = {
                'top-to-bottom': 0,
                'right-to-left': 90,
                'bottom-to-top': 180,
                'left-to-right': 270,
            }[this.flowDirection];

            return `background-image: url('${BASE_URL}/a_${ANGLE}/v1555784793/down-arrow.png')`;
        }

        protected get inputBallsCount(): number {
            if (this.workstation.input === Infinity) {
                return 0;
            }

            return this.workstation.input;
        }

        protected get inputColour(): string {
            if (this.workstation.isHeavilyUnderstaffed) {
                return `background-color: hsl(15, 100%, 66%);`;
            }

            if (this.workstation.isUnderStaffed) {
                return `background-color: hsl(39, 100%, 85%)`;
            }

            return `background-color: hsl(123, 100%, 85%)`;
        }
    }
</script>

<style lang="scss" scoped>
    .drag-area, .drop-area {
        width: 100%;
        height: 100%;
        background-color: hsl(203, 92%, 90%);
        background-size: 125px;
        background-blend-mode: overlay;
        background-repeat: no-repeat;
        background-position: center;

        &.dragging-over {
            background-color: hsl(203, 50%, 40%);
        }

        &:hover {
            cursor: pointer;

            &.dragging-over {
                background-color: hsl(203, 50%, 40%);
            }

            background-color: hsl(203, 92%, 70%);
        }
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
                    height: 15px;
                    width: 24px;
                    background-color: rgba(51, 51, 204, 0.77);
                    color: hsl(0, 0%, 80%);
                    bottom: 14.1px;
                    right: 38.3px;
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

        }

        .workers-area {
            outline: hsl(0, 0%, 20%) 1px solid;
            height: 150px;
            width: 100%;
            position: relative;

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
                position: relative;
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

            .input-balls-container {
                left: 0;
            }

            .output-balls-container {
                right: 0;
                flex-direction: row-reverse;
            }

            .input-balls-container, .output-balls-container {
                position: absolute;
                width: 60px;
                max-height: 150px;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
                // Making scrollbars invisible in Chrome, Safari and Opera
                &::-webkit-scrollbar {
                    width: 0 !important
                }

                overflow: -moz-scrollbars-none; // Making scrollbars invisible in firefox
                -ms-overflow-style: none; // Making scrollbars invisible in IE

                .ball {
                    width: 7px;
                    height: 7px;
                    border-radius: 7px;
                    border: darkblue 1px solid;
                    margin: 1px;
                }
            }
        }

        .output {
            background-color: hsl(240, 34%, 33%);
            color: hsl(0, 0%, 96%);
        }

        .input, .output {
            text-align: center;
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
