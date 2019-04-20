import {IRandomNumberGenerator} from '@/classes/IRandomNumberGenerator';

export class Dice implements IRandomNumberGenerator {
    private static MIN: number = 1;
    private static MAX: number = 6;
    private static randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private faceValue: number = 0;

    public roll(): number {
        const lastRoll: number = this.faceValue;

        do {
            this.faceValue = Dice.randomBetween(Dice.MIN, Dice.MAX);
        } while (lastRoll === this.faceValue);

        return this.faceValue;
    }
}
