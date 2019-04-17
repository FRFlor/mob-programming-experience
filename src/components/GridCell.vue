<template>
    <div class="cell" :class="{over}">
        <drop v-if="active"
              @dragover="over = true"
              @dragleave="over = false"
              class="drop-area"
              @drop="handleDrop">
            <drag :transfer-data="{ example: 'styling' }">
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

        protected over: boolean = false;
        protected CellContent = CellContent;

        protected handleDrop(data: any): void {
            this.over = false;
            alert(`You dropped with data: ${JSON.stringify(data)}`);
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

        &.over {
            background: red;
        }
    }
</style>
