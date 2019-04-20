<template>
    <div class="dice-view" :class="dice.isRolling ? 'is-rolling' : ''">
        <img v-for="i in 6"
             v-show="dice.value === i"
             :src="require(`../assets/d${i}.svg`)"
             :alt="`Dice face ${i}`">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Dice} from '@/classes/Dice';

    @Component
    export default class DiceView extends Vue {
        @Prop() protected dice!: Dice;
    }
</script>

<style lang="scss" scoped>
    .dice-view {
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
