import {Dice} from '@/classes/Dice';

const TEST_LOOP_COUNT: number = 100;
const D6_MIN_VALUE: number = 1;
const D6_MAX_VALUE: number = 6;

describe('Dice', () => {
    const dice: Dice = new Dice();

    it('generates only random values between 1 and 6', () => {
        for (let i = 0; i < TEST_LOOP_COUNT; i++) {
            const result: number = dice.roll();
            expect(result).toBeLessThanOrEqual(D6_MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(D6_MIN_VALUE);
        }
    });

    it('does not repeat the roll value between rolls', () => {
        let previousResult: number = 0;

        for (let i = 0; i < TEST_LOOP_COUNT; i++) {
            const result: number = dice.roll();
            expect(result).not.toEqual(previousResult);
            previousResult = result;
        }
    });
});
