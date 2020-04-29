import { Vec3, Quat, Vec2 } from "cc";

export const v2_t = new Vec2();

export const v3_t = new Vec3();

export const quat_t = new Quat();

export function parseTime2String (seconds: number): string {
    const s = seconds % 60;
    const m = Math.floor(seconds / 60);
    const ss = s > 9 ? s.toString() : '0' + s;
    const ms = m > 9 ? m.toString() : '0' + m;
    return ms + ':' + ss;
}