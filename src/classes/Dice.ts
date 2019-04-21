import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export class Dice implements IRandomNumberGenerator {
    private static MIN: number = 1;
    private static MAX: number = 6;
    public isRolling: boolean = false;
    private faceValue: number = 1;
    private waitMultiplier: number = 1;

    public get average(): number {
        return (Dice.MIN + Dice.MAX) / 2;
    }

    public get max(): number {
        return Dice.MAX;
    }

    public get value(): number {
        return this.faceValue;
    }

    public setWaitMultiplier(value: number): void {
        if (value < 0) {
            throw new DOMException('Wait Multiplier must be greater or equal to 0');
        }
        this.waitMultiplier = value;
    }

    public roll(): number {
        this.faceValue = randomBetween(Dice.MIN, Dice.MAX);

        return this.faceValue;
    }

    public async animatedRoll(): Promise<number> {
        this.isRolling = true;
        this.roll();

        // Instantaneous roll
        if (this.waitMultiplier === 0) {
            this.isRolling = false;
            return this.value;
        }

        for (let i = 0; i < 5; i++) {
            await this.delayRoll(100);
        }

        for (let i = 0; i < 5; i++) {
            await this.delayRoll(200);
        }

        for (let i = 0; i < 2; i++) {
            await this.delayRoll(400);
        }

        this.isRolling = false;

        return this.value;
    }

    private async delayRoll(ms: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, ms * this.waitMultiplier));
        this.roll();
    }
}
