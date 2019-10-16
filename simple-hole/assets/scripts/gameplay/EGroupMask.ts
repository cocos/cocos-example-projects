import { Enum } from "cc";

export enum EGroup {
    G_PLANE = 1 << 0,
    G_ROLE = 1 << 1,
    G_BODY = 1 << 2
}
Enum(EGroup);