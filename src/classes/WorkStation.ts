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
    private waitMultiplier: number = 1;

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

    public setWaitMultiplier(value: number): void {
        if (value < 0) {
            throw new DOMException('Wait Multiplier must be greater or equal to 0');
        }

        this.waitMultiplier = value;
        this.workersDice.forEach((dice: IRandomNumberGenerator) => dice.setWaitMultiplier(this.waitMultiplier));
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

    public async recalculateEffort(): Promise<number> {
        this.refreshDice();
        await Promise.all(this.workersDice.map(async (dice: IRandomNumberGenerator) => await dice.animatedRoll()));

        return this.effortCount;
    }

    public refreshDice(): void {
        this.workersDice = this.rngFactory.getRngArray(this.workerCount);
        this.workersDice.forEach((dice: IRandomNumberGenerator) => dice.setWaitMultiplier(this.waitMultiplier));
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

    public get isOkay(): boolean {
        if (this.input === Infinity) {
            return true;
        }

        return this.input <= this.averageWorkerEffort * this.numberOfWorkers;
    }

    public get isUnderStaffed(): boolean {
        if (this.isOkay) {
            return false;
        }

        return this.input <= this.maxWorkerEffort * this.numberOfWorkers;
    }

    public get isHeavilyUnderstaffed(): boolean {
        return !this.isOkay && !this.isUnderStaffed;
    }

    public get averageWorkerEffort(): number {
        return this.rngFactory.getRngArray(1)[0].average;
    }

    public get maxWorkerEffort(): number {
        return this.rngFactory.getRngArray(1)[0].max;
    }

    public async work(): Promise<void> {
        this.workDone = 0;
        await this.recalculateEffort();

        // Instantaneous calculation
        if (this.waitMultiplier === 0) {
            this.workDone = Math.min(this.inputCount, this.effortCount);
            this.outputCount += this.workDone;
            this.inputCount -= this.workDone;
            return;
        }

        // Animated drainage calculation
        await new Promise((resolve) => setTimeout(resolve, 750 * this.waitMultiplier));
        while (this.inputCount > 0 && this.effortRemaining > 0) {
            this.inputCount--;
            this.workDone++;
            this.outputCount++;

            // Linear wait time calculation:
            //  - 500ms if remaining effort is 3 or less
            //  - 50ms at the fastest (if remaining effort is a large value)
            const referenceTime: number = Math.min(this.effortRemaining, this.input);
            const waitTime = Math.min(Math.max((4700 - 400 * referenceTime) / 7, 50), 250);
            await new Promise((resolve) => setTimeout(resolve, waitTime * this.waitMultiplier));
        }
    }
}
