<template>
    <div class="cell" :class="{'dragging-over' : isDraggingOver, 'has-worker': content === CellContent.Worker}">
        <drop v-if="active"
              @dragover="isDraggingOver = true"
              @dragleave="isDraggingOver = false"
              class="drop-area"
              @drop="handleDrop">
            <drag class="drag-area"
                  :transfer-data="{ sourceId: id }">
                <div class="image-container">
                    <div class="count-badge" v-if="contentCount > 1" v-text="contentCount"></div>
                    <img v-if="content === CellContent.Station"
                         src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg" alt="station">
                    <img v-else-if="content === CellContent.Worker && contentCount === 1"
                         src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/man-user.svg" alt="worker">
                    <img v-else-if="content === CellContent.Worker"
                         src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/multiple-users.svg"
                         alt="workers">
                </div>
            </drag>
        </drop>
        <img v-if="content === CellContent.Station"
             src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg" alt="station">
        <div class="dice-container" :class="{'dice-on-top': diceOnTop}"
             v-if="content === CellContent.Worker"
             :style="{'grid-template-columns': `repeat(${contentCount > 3 ? '3' : contentCount}, 15px)`}">
            <dice-roll class="dice" v-for="i in contentCount" :key="i"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import DiceRoll from '@/components/DiceRoll.vue';

    export enum CellContent {
        Nothing = '',
        Worker = 'worker',
        Station = 'station',
    }

    @Component({
        components: {DiceRoll}
    })
    export default class GridCell extends Vue {
        @Prop({default: () => CellContent.Nothing}) protected content!: CellContent;
        @Prop({default: false, type: Boolean}) protected active!: boolean;
        @Prop({default: false, type: Boolean}) protected diceOnTop!: boolean;
        @Prop() protected id!: number;
        @Prop({default: 1}) protected contentCount!: number;

        protected isDraggingOver: boolean = false;
        protected CellContent = CellContent;

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
    .drop-area, .drag-area, .image-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .drag-area {
        position: relative;

        .count-badge {
            position: absolute;
            height: 20px;
            width: 20px;
            background-color: blue;
            color: white;
            bottom: 3px;
            right: 3px;
            border-radius: 20px;
            font-size: 0.7rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .cell {
        background-color: hsl(203, 92%, 90%);
        outline: hsl(0, 0%, 20%) 1px solid;
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .dice-container {
            display: grid;
            grid-column-gap: 2px;
            grid-row-gap: 2px;
            position: absolute;
            transform: translateY(100%);
            bottom: 0;
            z-index: 2;
            &.dice-on-top {
                top: 0;
                transform: translateY(-100%);
            }

            .dice {
                height: 15px;
                width: 15px;
            }
        }

        img {
            height: 30px;
            width: 30px;
        }

        &.has-worker:hover {
            cursor: pointer;
            background-color: hsl(203, 92%, 70%);
        }

        &.dragging-over {
            background-color: hsl(203, 50%, 40%);
        }
    }
</style>
