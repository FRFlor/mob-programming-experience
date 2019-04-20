import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';
import {IRngFactory} from '@/interfaces/IRngFactory';
import {Dice} from '@/classes/Dice';

export class DiceFactory implements IRngFactory {
    public getRngArray(amountOfDice: number): IRandomNumberGenerator[] {
        return Array.from({length: amountOfDice}, () => new Dice());
    }
}
