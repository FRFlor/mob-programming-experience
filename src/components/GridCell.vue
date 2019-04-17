<template>
    <div class="cell" :class="content">
        <img v-if="content === CellContent.Station" src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg" alt="station">
        <img v-else-if="content === CellContent.Worker" src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/man-user.svg" alt="worker">
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    export enum CellContent {
        Nothing = '',
        Worker = 'worker',
        Station = 'station',
    }

    @Component
    export default class GridHandler extends Vue {
        @Prop({default: () => CellContent.Nothing}) content!: CellContent;

        protected CellContent = CellContent;
    }
</script>

<style lang="scss" scoped>
    .cell {
        background-color: hsl(203, 92%, 90%);
        outline: hsl(0, 0%, 20%) 1px solid;
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            max-width: 100%;
            height: 65%;
        }

        &.worker {
            &:hover {
                cursor: pointer;
                background-color: hsl(30, 92%, 60%);
            }
        }
    }
</style>
