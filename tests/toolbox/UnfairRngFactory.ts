import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';
import {IRngFactory} from '@/interfaces/IRngFactory';
import {UnfairDice} from './UnfairDice';

export class UnfairRngFactory implements IRngFactory {
    public getRngArray(arraySize: number): IRandomNumberGenerator[] {
        return Array.from({length: arraySize}, () => new UnfairDice());
    }
}
