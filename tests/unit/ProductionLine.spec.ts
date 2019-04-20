import {ProductionLine} from '@/classes/ProductionLine';
import {UnfairDice} from '../toolbox/UnfairDice';
import {UnfairRngFactory} from '../toolbox/UnfairRngFactory';
import {WorkStation} from '@/classes/WorkStation';


describe('ProductionLine', () => {
    let productionLine: ProductionLine;

    beforeEach(() => {
        productionLine = new ProductionLine(new UnfairRngFactory());
        ProductionLine.WAIT_MULTIPLIER = 0;
        WorkStation.WAIT_MULTIPLIER = 0;
    });

    it('has infinite input value for the first workstation', () => {
        expect(productionLine.workStations[0].input).toBe(Infinity);
    });

    it('processes work for all the workstations', async () => {
        const startInputs: number[] = productionLine.workStations.map((workStation: WorkStation) => workStation.input);
        const effortGenerated: number = 1;
        UnfairDice.guaranteedRollValue = effortGenerated;

        // @ts-ignore
        await productionLine.generateProducts();

        for (let i = 0; i < productionLine.workStations.length; i++) {
            expect(productionLine.workStations[i].input).toBe(startInputs[i] - effortGenerated);
            expect(productionLine.workStations[i].effortRemaining).toBe(0);
            expect(productionLine.workStations[i].output).toBe(effortGenerated);
        }
    });

    it('transfers output from a workstation to the input box of the next one', async () => {
        const startInputs: number[] = productionLine.workStations.map((workStation: WorkStation) => workStation.input);
        UnfairDice.guaranteedRollValue = 1;

        await productionLine.work();

        // Every station except the last one, should have no output at this point (since the rng will always return 1)
        for (let i = 0; i < productionLine.workStations.length - 1; i++) {
            expect(productionLine.workStations[i].output).toBe(0);
            expect(productionLine.workStations[i].input).toBe(startInputs[i]);
        }

        const lastStation: WorkStation = productionLine.workStations[productionLine.workStations.length - 1];
        expect(lastStation.output).toBe(1);
        expect(lastStation.input).toBe(startInputs[productionLine.workStations.length - 1]);
    });

    it('allows workers to move from one station to another', () => {
        expect(productionLine.workStations[0].numberOfWorkers).toBe(1);
        expect(productionLine.workStations[1].numberOfWorkers).toBe(1);

        productionLine.moveWorker(0, 1);

        expect(productionLine.workStations[0].numberOfWorkers).toBe(0);
        expect(productionLine.workStations[1].numberOfWorkers).toBe(2);
    });

    it('allows all workers to be moved to a target station', () => {
        expect(productionLine.workStations[0].numberOfWorkers).toBe(1);
        productionLine.moveAllWorkersTo(0);
        expect(productionLine.workStations[0].numberOfWorkers).toBe(10);
    });
});
