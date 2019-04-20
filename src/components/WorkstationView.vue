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
              :class="{'dragging-over' : isDraggingOver}"
              @dragover="isDraggingOver = true"
              @dragleave="isDraggingOver = false"
              @drop="handleDrop">
            <drag class="drag-area"
                  :transfer-data="{ sourceId: id }"
                  :image="require('../assets/mini-man.png')">
                <div class="workers">
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

    @Component({components: {DiceView}})
    export default class WorkstationView extends Vue {
        @Prop() protected id!: number;
        @Prop() protected workstation!: WorkStation;

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
