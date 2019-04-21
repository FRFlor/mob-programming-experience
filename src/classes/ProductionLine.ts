import {WorkStation} from '@/classes/WorkStation';
import {IRngFactory} from '@/interfaces/IRngFactory';

const assertWorkstationExists = (id: number) => {
    if (id < 0 || id >= ProductionLine.STATIONS_COUNT) {
        throw new DOMException(`Non-existing workstation of #${id}`);
    }
};

export class ProductionLine {
    public static WAIT_MULTIPLIER: number = 1;
    public static STARTING_INPUT: number = 4;
    public static STATIONS_COUNT: number = 10;
    public workStations: WorkStation[] = [];
    private daysElapsed: number = 0;
    private rngFactory: IRngFactory;

    constructor(rngFactory: IRngFactory) {
        this.rngFactory = rngFactory;
        this.restart();
    }

    public get days(): number {
        return this.daysElapsed;
    }

    public async work(): Promise<void> {
        await this.generateProducts();
        await new Promise((resolve) => setTimeout(resolve, 300 * ProductionLine.WAIT_MULTIPLIER));
        await this.moveAllProductsAlong();
        this.daysElapsed++;
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

    public restart(): void {
        this.workStations = Array.from({length: ProductionLine.STATIONS_COUNT}, () => new WorkStation(this.rngFactory));
        this.workStations.forEach((workStation: WorkStation) => workStation.setInput(ProductionLine.STARTING_INPUT));
        this.workStations[0].setInput(Infinity);
        this.daysElapsed = 0;
    }

    protected async generateProducts(): Promise<void> {
        await Promise.all(this.workStations.map(async (workStation: WorkStation) => await workStation.work()));
    }

    protected async moveAllProductsAlong(): Promise<void> {
        await Promise.all(this.workStations.map(async (workStation: WorkStation, index: number) => {
            if (index === ProductionLine.STATIONS_COUNT - 1) {
                return;
            }

            await this.turnOutputsIntoInputs(index);
        }));
    }

    protected async turnOutputsIntoInputs(workstationId: number): Promise<void> {
        const source: WorkStation = this.workStations[workstationId];
        const destination: WorkStation = this.workStations[workstationId + 1];

        while (source.output > 0) {
            source.decrementOutput();
            destination.incrementInput();
            const waitTime = Math.min(Math.max((4700 - 400 * source.output) / 7, 50), 150);
            await new Promise((resolve) => setTimeout(resolve, waitTime * ProductionLine.WAIT_MULTIPLIER));
        }
    }
}
