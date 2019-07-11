const { Node } = cc;

export function getDebugUtils (node) {
    const scene = node.scene;
    const debugShapesHubName = "FuckDebugShapesHub";
    let debugShapesHub = scene.getChildByName(debugShapesHubName);
    if (!debugShapesHub) {
        debugShapesHub = new Node(debugShapesHubName);
        scene.addChild(debugShapesHub);
    }
    return { debugShapesHub };
}

export function createDebugShapeNode () {
    const node = new Node('Physics shape debug node');
    return node;
}
