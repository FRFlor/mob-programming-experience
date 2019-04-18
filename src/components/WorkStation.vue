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
            <div class="worker-avatar">
                <img v-if="numberOfWorkers === 1"
                     src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/man-user.svg"
                     alt="single worker">
                <img v-else-if="numberOfWorkers > 1"
                     src="https://res.cloudinary.com/felipeflor/image/upload/v1555262973/multiple-users.svg"
                     alt="multiple workers">
                <div class="count-badge" v-if="numberOfWorkers > 1" v-text="numberOfWorkers"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class WorkStation extends Vue {
        protected numberOfWorkers: number = 1;
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
            .worker-avatar {
                position: relative;
                height: 50px;
                width: 50px;
                margin: 5px  auto;
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
