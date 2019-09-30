
/**
 * 将组件的一些生命周期规定在行为接口中
 */

interface IMotorBehaviour {

    onLoad: Function,

    start: Function,

    update: Function,

    lateUpdate?: Function
}