import {StationChain} from '@/classes/StationChain';
import {UnfairDice} from '../toolbox/UnfairDice';
import {UnfairRngFactory} from '../toolbox/UnfairRngFactory';
import {WorkStation} from '@/classes/WorkStation';


describe('StationChain', () => {
    let stationChain: StationChain;

    beforeEach(() => {
        stationChain = new StationChain(new UnfairRngFactory());
    });

    it('has infinite input value for the first workstation', () => {
        expect(stationChain.workStations[0].input).toBe(Infinity);
    });

    it('processes work for all the workstations', () => {
        const startInputs: number[] = stationChain.workStations.map((workStation: WorkStation) => workStation.input);
        const effortGenerated: number = 1;
        UnfairDice.guaranteedRollValue = effortGenerated;

        stationChain.work();

        for (let i = 0; i < stationChain.workStations.length; i++) {
            expect(stationChain.workStations[i].input).toBe(startInputs[i] - effortGenerated);
            expect(stationChain.workStations[i].effortRemaining).toBe(0);
            expect(stationChain.workStations[i].output).toBe(effortGenerated);
        }
    });

    it('transfers output from a workstation to the input box of the next one', () => {
        const startInputs: number[] = stationChain.workStations.map((workStation: WorkStation) => workStation.input);
        UnfairDice.guaranteedRollValue = 1;

        stationChain.work();
        stationChain.processOutputs();

        // Every station except the last one, should have no output at this point (since the rng will always return 1)
        for (let i = 0; i < stationChain.workStations.length - 1; i++) {
            expect(stationChain.workStations[i].output).toBe(0);
            expect(stationChain.workStations[i].input).toBe(startInputs[i]);
        }

        const lastStation: WorkStation = stationChain.workStations[stationChain.workStations.length - 1];
        expect(lastStation.output).toBe(1);
        expect(lastStation.input).toBe(startInputs[stationChain.workStations.length - 1]);
    });
});
