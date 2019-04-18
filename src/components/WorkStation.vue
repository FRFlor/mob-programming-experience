<template>
    <div class="work-station">
        <div class="station-header">
            <div class="input">
                <h2>Input</h2>
            </div>

            <div class="station-title">
                <h2>Station X</h2>
                <img class="computer-image"
                     src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/laptop.svg"
                     alt="Computer">
            </div>

            <div class="output">
                <h2>Output</h2>
            </div>
        </div>

        <div class="workers">

        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class WorkStation extends Vue {
    }
</script>

<style lang="scss" scoped>
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
            background-color: hsl(203, 92%, 90%);
        }

        .workers {
            background-color: hsl(100, 92%, 90%);
            outline: hsl(0, 0%, 20%) 1px solid;
            height: 150px;
            width: 100%;
        }

        .input, .output {
            text-align: center;
            background-color: hsl(39, 100%, 85%);
            min-width: 50px;
            min-height: 50px;
            outline: hsl(0, 0%, 20%) 1px solid;
        }
    }

</style>
