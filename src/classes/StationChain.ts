import {WorkStation} from '@/classes/WorkStation';
import {IRngFactory} from '@/interfaces/IRngFactory';

export class StationChain {
    public static STARTING_INPUT: number = 3;
    public static STATIONS_COUNT: number = 10;
    public workStations: WorkStation[];

    constructor(rngFactory: IRngFactory) {
        this.workStations = Array.from({length: StationChain.STATIONS_COUNT}, () => new WorkStation(rngFactory));
        this.workStations.forEach((workStation: WorkStation) => workStation.setInput(StationChain.STARTING_INPUT));
        this.workStations[0].setInput(Infinity);
    }

    public work(): void {
        this.workStations.forEach((workStation: WorkStation) => workStation.work());
    }

    public processOutputs(): void {
        for (let i = 0; i < this.workStations.length - 1; i++) {
            while (this.workStations[i].output > 0) {
                this.workStations[i].decrementOutput();
                this.workStations[i + 1].incrementInput();
            }
        }
    }
}
