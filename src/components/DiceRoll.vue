<template>
    <div class="dice-roll" :class="isRolling ? 'is-rolling' : ''">
        <img v-show="value === 1" :src="require('../assets/d1.svg')" alt="Dice face 1">
        <img v-show="value === 2" :src="require('../assets/d2.svg')" alt="Dice face 2">
        <img v-show="value === 3" :src="require('../assets/d3.svg')" alt="Dice face 3">
        <img v-show="value === 4" :src="require('../assets/d4.svg')" alt="Dice face 4">
        <img v-show="value === 5" :src="require('../assets/d5.svg')" alt="Dice face 5">
        <img v-show="value === 6" :src="require('../assets/d6.svg')" alt="Dice face 6">
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    const randomBetween = (min: number, max: number) =>  Math.floor(Math.random() * (max - min + 1) ) + min;
    const MAX: number = 6;
    const MIN: number = 1;

    @Component
    export default class DiceRoll extends Vue {
        protected value: number = 1;
        protected isRolling: boolean = false;

        public roll(): void {
            this.isRolling = true;
            let delayMs: number = 100;
            this.instantRoll();
            for (let i = 0; i < 5; i++) {
                this.delayRoll(delayMs);
                delayMs += 100;
            }
            for (let i = 0; i < 5; i++) {
                this.delayRoll(delayMs);
                delayMs += 200;
            }
            for (let i = 0; i < 4; i++) {
                this.delayRoll(delayMs);
                delayMs += 400;
            }

            setTimeout(() => this.isRolling = false, delayMs);
        }

        private delayRoll(ms: number): void {
            setTimeout(() => this.instantRoll(), ms);
        }

        private instantRoll(): void {
            const previous: number = this.value;
            do {
                this.value = randomBetween(MIN, MAX);
            } while (this.value === previous);
        }
    }
</script>

<style lang="scss" scoped>
    .dice-roll {
        height: 45px;
        width: 45px;
        transition: all 200ms ease;
        img {
            height: 100%;
            max-width: 100%;
        }

        &.is-rolling {
            transform: scale(0.75);
        }
    }
</style>
