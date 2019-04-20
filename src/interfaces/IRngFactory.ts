import {IRandomNumberGenerator} from '@/interfaces/IRandomNumberGenerator';

export interface IRngFactory {
    getRngArray(arraySize: number): IRandomNumberGenerator[];
}
