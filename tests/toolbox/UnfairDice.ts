import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';

export class UnfairDice implements IRandomNumberGenerator {
    public static guaranteedRollValue: number = 3;
    public isRolling: boolean = true;
    public average: number = UnfairDice.guaranteedRollValue;
    public max: number = UnfairDice.guaranteedRollValue;

    public roll() {
        return UnfairDice.guaranteedRollValue;
    }

    public get value() {
        return UnfairDice.guaranteedRollValue;
    }

    public async animatedRoll(): Promise<number> {
        return UnfairDice.guaranteedRollValue;
    }
}
