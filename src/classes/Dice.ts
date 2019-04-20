import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export class Dice implements IRandomNumberGenerator {
    private static MIN: number = 1;
    private static MAX: number = 6;
    public isRolling: boolean = false;
    private faceValue: number = 1;

    public get value(): number {
        return this.faceValue;
    }

    public roll(): number {
        const lastRoll: number = this.faceValue;

        do {
            this.faceValue = randomBetween(Dice.MIN, Dice.MAX);
        } while (lastRoll === this.faceValue);

        return this.faceValue;
    }

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
}
