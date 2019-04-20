<template>
    <div class="dice-roll" :class="dice.isRolling ? 'is-rolling' : ''">
        <img v-show="dice.value === 1" :src="require('../assets/d1.svg')" alt="Dice face 1">
        <img v-show="dice.value === 2" :src="require('../assets/d2.svg')" alt="Dice face 2">
        <img v-show="dice.value === 3" :src="require('../assets/d3.svg')" alt="Dice face 3">
        <img v-show="dice.value === 4" :src="require('../assets/d4.svg')" alt="Dice face 4">
        <img v-show="dice.value === 5" :src="require('../assets/d5.svg')" alt="Dice face 5">
        <img v-show="dice.value === 6" :src="require('../assets/d6.svg')" alt="Dice face 6">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Dice} from '@/classes/Dice';

    @Component
    export default class DiceRoll extends Vue {
        @Prop() protected dice!: Dice;
    }
</script>

<style lang="scss" scoped>
    .dice-roll {
        background-color: white;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        transition: all 400ms ease;
        img {
            width: 100%;
            height: 100%;
        }

        &.is-rolling {
            transform: scale(0.75);
        }
    }
</style>
