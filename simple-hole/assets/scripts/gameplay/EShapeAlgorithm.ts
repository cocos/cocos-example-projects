import { Enum, math } from "cc";

export enum EShapeAlgorithm {
    RANDOM = 0,
    X_SQUARE_2 = 1,
    SPIRAL = 2
}
Enum(EShapeAlgorithm);

const _tmpVec3 = new math.Vec3;
_tmpVec3.y = 1;

export function random_algorithm (max: number, min: number): math.Vec3 {
    _tmpVec3.x = Math.random() * (max - min) + min;
    _tmpVec3.z = Math.random() * (max - min) + min;
    return _tmpVec3;
}

export function x_square_2_algorithm (index: number, total: number): math.Vec3 {
    let half = total / 2;
    _tmpVec3.z = index - half;
    _tmpVec3.x = _tmpVec3.z > 0 ? Math.sqrt(_tmpVec3.z) : -Math.sqrt(Math.abs(_tmpVec3.z));
    _tmpVec3.z = Math.abs(_tmpVec3.z);
    return _tmpVec3;
}

export function spiral_algorithm (index: number, total: number): math.Vec3 {
    let t = index / total * 3.1415926 * 2 + 0.5; // [0, 2pi]
    _tmpVec3.x = t * 7 * Math.cos(t * 7);
    _tmpVec3.z = t * 7 * Math.sin(t * 7);
    return _tmpVec3;
}

// export function five_block_algorithm (index: number, total: number, max: number, min: number): math.Vec3 {
//     let count = Math.floor(total / 5);
//     let i = index % count;
//     let p = index / total;
//     let center = (max + min) / 2;
//     let half = center + (max - center) / 2;
//     let sampleVec3 = new math.Vec3(center, 1, center);
//     if (p > 0.2 && p <= 0.4) {
//         sampleVec3.x = half;
//         sampleVec3.z = half;
//     } else if (p > 0.4 && p <= 0.6) {
//         sampleVec3.x = -half;
//         sampleVec3.z = half;
//     } else if (p > 0.6 && p <= 0.8) {
//         sampleVec3.x = half;
//         sampleVec3.z = -half;
//     } else if (p > 0.8 && p <= 1.0) {
//         sampleVec3.x = -half;
//         sampleVec3.z = -half;
//     }

//     /**
//      * 1. (2n-1)^2
//      * 2. 8n+1
//      */
//     function total_n_formula (n: number) {
//         return Math.pow(2, 2 * n - 1);
//     }

//     let _t = 0;
//     while (i < total_n_formula(_t)) { _t++; }

//     let _t_start = 0;
//     if (_t > 0) _t_start = i - total_n_formula(_t - 1);

//     let _t_amount = 8 * _t + 1;

//     // TODO:

//     return _tmpVec3;
// }
