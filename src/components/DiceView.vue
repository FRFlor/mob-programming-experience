<template>
    <div class="dice-view elevated" :class="dice.isRolling ? 'is-rolling' : ''">
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
    .elevated {
        box-shadow: 0 3px 5px -1px rgba(0,0,0,0.3),
        0 5px 8px 0 rgba(0,0,0,0.24),
        0 1px 14px 0px rgba(0,0,0,0.22);
    }

    .dice-view {
        background-color: hsla(162, 0%, 90%, 0.85);
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
