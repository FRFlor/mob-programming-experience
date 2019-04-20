export interface IRandomNumberGenerator {
    roll: () => number;
    animatedRoll: () => Promise<number>;
    value: number;
    isRolling: boolean;
}
