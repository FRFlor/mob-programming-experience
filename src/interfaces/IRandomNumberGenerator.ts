export interface IRandomNumberGenerator {
    roll: () => number;
    animatedRoll: () => Promise<number>;
    setWaitMultiplier: (value: number) => void;
    value: number;
    isRolling: boolean;
    average: number;
    max: number;
}
