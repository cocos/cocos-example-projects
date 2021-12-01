
import { _decorator, Component, Node } from 'cc';
import { DEBUG } from 'cc/env';
const { ccclass, property } = _decorator;

export function CC_LOG_DEBUG(...params: any[]) {
    if (DEBUG) {
        console.log(...params);
    }
}


/**Single thread method manager.
 * methods are saved in MethodMap.
 */
export class MethodManager {
    private methodMap: Map<String, Function>;
    public static instance: MethodManager = new MethodManager;
    public addMethod(methodName: String, f: Function): boolean {
        if (!this.methodMap.get(methodName)) {
            this.methodMap.set(methodName, f);
            return true;
        }
        return false;
    }
    public applyMethod(methodName: String, arg?: String): boolean {
        if (!this.methodMap.get(methodName)) {
            CC_LOG_DEBUG("Function " + methodName + " not exist",);
            return false;
        }
        var f = this.methodMap.get(methodName);
        try {
            f?.call(null, arg);
            return true;
        } catch (e) {
            console.log("Function trigger error: " + e);
            return false;
        }
    }
    public removeMethod(methodName: String): any {
        return this.methodMap.delete(methodName);
    }
    constructor() {
        this.methodMap = new Map<String, Function>();
        MethodManager.instance = this;

    }
}
