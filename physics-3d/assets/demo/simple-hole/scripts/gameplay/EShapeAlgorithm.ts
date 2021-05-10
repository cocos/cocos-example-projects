import { Enum, math } from "cc";

export enum EShapeAlgorithm {
    RANDOM = 0,
    X_SQUARE_2 = 1,
    SPIRAL = 2
}
Enum(EShapeAlgorithm);

const _tmpVec3 = new math.Vec3;
_tmpVec3.y = 1.5;

export function random_algorithm(max: number, min: number): math.Vec3 {
    _tmpVec3.x = Math.random() * (max - min) + min;
    _tmpVec3.z = Math.random() * (max - min) + min;
    return _tmpVec3;
}

const offset = 10;
export function x_square_2_algorithm(index: number, total: number): math.Vec3 {
    let half = (total - 1) / 2;
    _tmpVec3.z = index - half;
    _tmpVec3.x = _tmpVec3.z > 0 ? Math.sqrt(_tmpVec3.z) : -Math.sqrt(Math.abs(_tmpVec3.z));
    _tmpVec3.z = Math.abs(_tmpVec3.z) - offset;
    return _tmpVec3;
}

export function spiral_algorithm(index: number, total: number): math.Vec3 {
    let t = index / total * 3.1415926 * 0.75 + 0.5; // [0, 2pi]
    _tmpVec3.x = t * 6.6 * Math.cos(t * 6.6);
    _tmpVec3.z = t * 6.6 * Math.sin(t * 6.6);
    return _tmpVec3;
}