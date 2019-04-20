import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';

export class UnfairDice implements IRandomNumberGenerator {
    public static guaranteedRollValue: number = 3;

    public roll() {
        return UnfairDice.guaranteedRollValue;
    }

    public get value() {
        return UnfairDice.guaranteedRollValue;
    }
}
