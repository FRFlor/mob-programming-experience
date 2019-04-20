import {IRandomNumberGenerator} from '@/classes/IRandomNumberGenerator';

export class UnfairDice implements IRandomNumberGenerator {
    public guaranteedRollValue: number = 3;

    public roll() {
        return this.guaranteedRollValue;
    }
}
