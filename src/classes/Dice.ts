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

    public async animatedRoll(): Promise<number> {
        this.isRolling = true;
        this.roll();

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
        await new Promise((resolve) => setTimeout(resolve, ms));
        this.roll();
    }
}
