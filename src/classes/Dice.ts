import {IRandomNumberGenerator} from '@/classes/IRandomNumberGenerator';

export class Dice implements IRandomNumberGenerator {
    private static MIN: number = 1;
    private static MAX: number = 6;
    private isRolling: boolean = false;

    private static randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private faceValue: number = 0;

    public animatedRoll(): void {
        this.isRolling = true;
        let delayMs: number = 100;
        this.roll();
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
        setTimeout(() => this.roll(), ms);
    }

    public roll(): number {
        const lastRoll: number = this.faceValue;

        do {
            this.faceValue = Dice.randomBetween(Dice.MIN, Dice.MAX);
        } while (lastRoll === this.faceValue);

        return this.faceValue;
    }
}
