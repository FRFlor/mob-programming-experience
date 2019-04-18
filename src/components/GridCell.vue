<template>
    <div class="cell" :class="{'dragging-over' : isDraggingOver}">
        <drop v-if="active"
              @dragover="isDraggingOver = true"
              @dragleave="isDraggingOver = false"
              class="drop-area"
              @drop="handleDrop">
            <drag :transfer-data="{ sourceId: id }">
                <img v-if="content === CellContent.Station"
                     src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg" alt="station">
                <img v-else-if="content === CellContent.Worker"
                     src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/man-user.svg" alt="worker">
            </drag>
        </drop>
        <img v-if="content === CellContent.Station"
             src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg" alt="station">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    export enum CellContent {
        Nothing = '',
        Worker = 'worker',
        Station = 'station',
    }


    @Component
    export default class GridCell extends Vue {
        @Prop({default: () => CellContent.Nothing}) protected content!: CellContent;
        @Prop({default: false, type: Boolean}) protected active!: boolean;
        @Prop() protected id!: number;
        @Prop({default: 1}) protected contentCount!: number;

        protected isDraggingOver: boolean = false;
        protected CellContent = CellContent;

        protected handleDrop(payload: any): void {
            this.isDraggingOver = false;
            if (! payload) {
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
    .drop-area {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cell {
        background-color: hsl(203, 92%, 90%);
        outline: hsl(0, 0%, 20%) 1px solid;
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            height: 30px;
            width: 30px;
        }

        &.worker {
            &:hover {
                cursor: pointer;
                background-color: hsl(30, 92%, 60%);
            }
        }

        &.dragging-over {
            background: red;
        }
    }
</style>
