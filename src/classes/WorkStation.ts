import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';
import {IRngFactory} from '@/interfaces/IRngFactory';

const assertGreaterThanZero = (value: number) => {
    if (value < 0) {
        throw new DOMException('Cannot be lower than 0');
    }
};

export class WorkStation {
    public workersDice: IRandomNumberGenerator[];
    private workerCount: number = 1;
    private inputCount: number = 0; // Material to work with
    private workDone: number = 0;
    private outputCount: number = 0; // Total production from last work cycle
    private rngFactory: IRngFactory;

    constructor(rngFactory: IRngFactory) {
        this.rngFactory = rngFactory;
        this.workersDice = this.rngFactory.getRngArray(this.workerCount);
    }

    public get numberOfWorkers(): number {
        return this.workerCount;
    }

    public get input(): number {
        return this.inputCount;
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
        this.refreshDice();
    }

    public incrementWorkers(): void {
        this.setNumberOfWorkers(this.numberOfWorkers + 1);
    }

    public decrementWorkers(): void {
        this.setNumberOfWorkers(this.numberOfWorkers - 1);
    }

    public get workersEffort(): number[] {
        return this.workersDice.map((dice: IRandomNumberGenerator) => dice.value);
    }

    public recalculateEffort(): number {
        this.refreshDice();
        this.workersDice.forEach((dice: IRandomNumberGenerator) => dice.roll());

        return this.effortCount;
    }

    public async animatedRecalculateEffort(): Promise<number> {
        this.refreshDice();

        for (let i = 0; i < this.numberOfWorkers - 1; i++) {
            this.workersDice[i].animatedRoll();
        }
        await this.workersDice[this.numberOfWorkers - 1].animatedRoll();
        await new Promise((resolve) => setTimeout(resolve, 100));

        return this.effortCount;
    }

    public refreshDice(): void {
        this.workersDice = this.rngFactory.getRngArray(this.workerCount);
    }

    public diceAreRolling(): boolean {
        return this.workersDice.find((dice: IRandomNumberGenerator) => !dice.isRolling) === undefined;
    }

    public get effortCount(): number {
        return this.workersEffort.reduce((prev: number, currentValue: number) => currentValue + prev, 0);
    }

    public get effortRemaining(): number {
        return this.effortCount - this.workDone;
    }

    public work(): void {
        this.recalculateEffort();

        while (this.inputCount > 0 && this.effortRemaining > 0) {
            this.inputCount--;
            this.workDone++;
            this.outputCount++;
        }
    }

    public async animatedWork() {
        this.workDone = 0;
        await this.animatedRecalculateEffort();
        while (this.inputCount > 0 && this.effortRemaining > 0) {
            this.inputCount--;
            this.workDone++;
            this.outputCount++;
        }
    }
}
