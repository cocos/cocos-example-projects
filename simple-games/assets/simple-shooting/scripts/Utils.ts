import { Node } from "cc";

export class Utils {
    static walkNode(node: Node, callback: any) {
        callback(node);
        node.children.forEach((childNode) => {
            this.walkNode(childNode, callback);
        })
    }
}
