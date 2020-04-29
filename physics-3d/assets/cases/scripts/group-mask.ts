import { Enum } from "cc";

export const PHY_GROUP = {
    G_0: 1 << 0,
    G_1: 1 << 1,
    G_2: 1 << 2,
    G_12: 1 << 1 + 1 << 2,
    G_ALL: -1
};

Enum(PHY_GROUP);

export const PHY_MASK = {
    M_0: 1 << 0,
    M_1: 1 << 1,
    M_2: 1 << 2,
    M_12: (1 << 1) + (1 << 2),
    M_ALL: -1
};

Enum(PHY_MASK);
