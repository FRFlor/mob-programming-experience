import {IRandomNumberGenerator} from '@/classes/IRandomNumberGenerator';
import {Dice} from '@/classes/dice';

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

    public setInput(amount: number): void {
        if (amount < 0) {
            throw new DOMException('InputCount cannot be lower than 0');
        }
        this.inputCount = amount;
    }

    public setNumberOfWorkers(amount: number): void {
        if (amount < 0) {
            throw new DOMException('WorkerCount cannot be lower than 0');
        }

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
