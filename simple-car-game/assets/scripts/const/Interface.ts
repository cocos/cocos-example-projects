
/**
 * 将组件的一些生命周期规定在行为接口中
 */

interface IMotorBehaviour {

    onLoad: Function,

    start: Function,

    update: Function,

    lateUpdate?: Function
}

/**
 * 定义地图结构
 */

interface IMapStruct {
    n: string,
    p: { x: number, y: number, z: number },
    r: { x: number, y: number, z: number, w: number },
    s: { x: number, y: number, z: number }
}