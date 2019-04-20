import {WorkStation} from '@/classes/WorkStation';
import {IRngFactory} from '@/interfaces/IRngFactory';

const assertWorkstationExists = (id: number) => {
    if (id < 0 || id >= ProductionLine.STATIONS_COUNT) {
        throw new DOMException(`Non-existing workstation of #${id}`);
    }
};

export class ProductionLine {
    public static WAIT_MULTIPLIER: number = 1;
    public static STARTING_INPUT: number = 3;
    public static STATIONS_COUNT: number = 10;
    public workStations: WorkStation[];

    constructor(rngFactory: IRngFactory) {
        this.workStations = Array.from({length: ProductionLine.STATIONS_COUNT}, () => new WorkStation(rngFactory));
        this.workStations.forEach((workStation: WorkStation) => workStation.setInput(ProductionLine.STARTING_INPUT));
        this.workStations[0].setInput(Infinity);
    }

    public async work(): Promise<void> {
        await this.generateProducts();
        await this.moveAllProductsAlong();
    }

    public async generateProducts(): Promise<void> {
        await Promise.all(this.workStations.map(async (workStation: WorkStation) => await workStation.work()));
    }

    public async moveAllProductsAlong(): Promise<void> {
        await Promise.all(this.workStations.map(async (workStation: WorkStation, index: number) => {
            if (index === ProductionLine.STATIONS_COUNT - 1) {
                return;
            }

            await this.turnOutputsIntoInputs(index);
        }));
    }

    public async turnOutputsIntoInputs(workstationId: number): Promise<void> {
        const source: WorkStation = this.workStations[workstationId];
        const destination: WorkStation = this.workStations[workstationId + 1];

        while (source.output > 0) {
            source.decrementOutput();
            destination.incrementInput();
            const waitTime = Math.min(Math.max((4700 - 400 * source.output) / 7, 50), 500);
            await new Promise((resolve) => setTimeout(resolve, waitTime * ProductionLine.WAIT_MULTIPLIER));
        }
    }


    public moveWorker(from: number, to: number): void {
        assertWorkstationExists(from);
        assertWorkstationExists(to);
        this.workStations[from].decrementWorkers();
        this.workStations[to].incrementWorkers();
    }

    public moveAllWorkersTo(stationId: number): void {
        const destination: WorkStation = this.workStations[stationId];

        this.workStations.forEach((station: WorkStation) => {
            if (destination === station) {
                return;
            }

            while (station.numberOfWorkers > 0) {
                station.decrementWorkers();
                destination.incrementWorkers();
            }
        });
    }
}
