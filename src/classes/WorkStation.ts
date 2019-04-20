import {IRandomNumberGenerator} from '@/classes/IRandomNumberGenerator';
import {Dice} from '@/classes/dice';

const assertGreaterThanZero = (value: number) => {
    if (value < 0) {
        throw new DOMException('Cannot be lower than 0');
    }
};

export class WorkStation {
    private workerCount: number = 1;
    private inputCount: number = 0; // Material to work with
    private effortCount: number = 0; // Amount of work generated
    private outputCount: number = 0; // Total production from last work cycle

    private rng: IRandomNumberGenerator; // Used to simulate variance on worker effort

    constructor(rng: IRandomNumberGenerator | null = null) {
        this.rng = (rng === null) ? new Dice() : rng;
    }

    public get numberOfWorkers(): number {
        return this.workerCount;
    }

    public get input(): number {
        return this.inputCount;
    }

    public get effortRemaining(): number {
        return this.effortCount;
    }

    public get output(): number {
        return this.outputCount;
    }

    public setOutput(amount: number): void {
        assertGreaterThanZero(amount);
        this.outputCount = amount;
    }

    public decrementOutput(): void {
        this.setOutput(this.outputCount - 1);
    }

    public setInput(amount: number): void {
        assertGreaterThanZero(amount);
        this.inputCount = amount;
    }

    public incrementInput(): void {
        this.setInput(this.inputCount + 1);
    }

    public setNumberOfWorkers(amount: number): void {
        assertGreaterThanZero(amount);
        this.workerCount = amount;
    }

    public recalculateEffort(): number {
        this.effortCount = 0;

        for (let i = 0; i < this.workerCount; i++) {
            this.effortCount += this.rng.roll();
        }

        return this.effortCount;
    }

    public work(): void {
        this.recalculateEffort();

        while (this.inputCount > 0 && this.effortCount > 0) {
            this.inputCount--;
            this.effortCount--;
            this.outputCount++;
        }
    }
}
