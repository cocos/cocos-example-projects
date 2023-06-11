# Cocos Creator Example Projects

## Introduction

This repository contains several highly requested examples to demonstrate how to use certain feature in Cocos Creator, each folder is a separated project.

## Example Cases

- native-plugin: demonstrates how to create a native plugin and use it in a native project template.
- native-script-bridge: The native script bridge demonstrates the interaction between the native C++ code and the script code.
- npm-case: demonstrates how to use a valid NPM module.
- occlusion-query: demonstrates how to setup occlusion query feature for better culling in complex projects.
- physics-3d: demonstrates all features of 3d physics module, including simple physics games and feature usage cases.
- protobuf: demonstrates how to successfully use protobuf module in your project.

## Contribution

For future contributors and maintainers, please apply to the same rigorous examination and documentation style as we have established so far.

It is the only way for us to reach far.

If some bug is forcing you to do some hacking, workaround, or any kind of strange logic that is not immediately comprehensible, be sure to add clear explanation comments at obvious places nearby.

Every 'unpleasant surprise' encountered along the road is a big deal:

Either something is not working, or some designed feature is far less intuitive than what the designer thought it would be.

So make sure to do all the followings:

- Try to classify the problem: is it editor-related or engine-originated? Which module(s) were involved?
- File an [issue](https://www.github.com/cocos/cocos-engine/issues) to the relevant team
- If it is a bug, clearly document it in code (usually near your temporary workaround) with the issue number.
- If it is a feature(or lack of one) and looks/feels strange/awkward no matter how you design the relevant system, make sure to write it down in the issue ticket with detailed explanation on your design decisions and why the engine API is not a good fit.
- Remove all the workaround or temporary designs once the bug is fixed or new feature is introduced.
