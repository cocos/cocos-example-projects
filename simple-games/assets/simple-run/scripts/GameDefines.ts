class GameDefines {
    static floorLength: number = 10;
    static maxActiveFloor: number = 50;
    static leftLineX: number = 5;
    static middleLineX: number = 0;
    static rightLineX: number = -5;
    static CoinNodeName: string = 'Coin';
    static BlockNodeName: string = 'RoadBlock';
}

enum GameState {
    INIT,
    PLAYING,
    END
}

export {GameDefines, GameState}