# Cocos Creator 3D Example cases

## show-cases

1. scenes/ambient: ambient lighting
2. scenes/audio: audio system baseline test
3. scenes/collision-detection: simple collision detection
4. scenes/custom-effect: custom shader
5. scenes/helmet: PBR material showcase, skybox
6. scenes/instanced-skinning: massive skinning models using GPU instancing
7. scenes/jellyfish: animation, transparent material, simple prefab instantiation
8. scenes/knight: animation, light
9. scenes/particle-compare: various particle effects
10.  scenes/pbr: PBR baseline
11. scenes/physics: rigidbody physics simulation
12. scenes/shadertoy: simple example on importing shadertoy resources
13. scenes/shadows: planar shadow demo
14. scenes/skin: pre-integrated SSS demo
15. scenes/sponza: multiple render target, particle effects, spot lights
16. scenes/tangents: glTF tangent space data conformance test
17. scenes/toon: NPR baseline
18. scenes/winter: particle system, emitter editing

## simple-fps

A really simple and lame FPS shooting game demo

## Contribution

For future contributer and maintainers, please apply to the same rigorous examination and documentation style as we have established so far.

It is the only way for us to reach far.

If some bug is forcing you to do some hacking, workaround, or any kind of strange logic that is not immediately comprehensible, be sure to add clear explanation comments at obvious places nearby.

Every 'unpleasant surprise' encountered along the road is a big deal:

Either something is not working, or some designed feature is far less intuitive than what the designer thought it would be.

So make sure to do all the followings:

* try to classify the problem: is it editor-related or engine-originated? Which module(s) were involved?
* file an [issue](https://www.github.com/cocos-creator/engine/issues) to the relevant team
* If it is a bug, clearly document it in code (usually near your temporary workaround) with the issue number.
* If it is a feature(or lack of one) and looks/feels strange/awkward no matter how you design the relevant system, make sure to write it down in the issue ticket with detailed explaination on your design decisions and why the engine API is not a good fit.
* Remove all the workaround or temporary designs once the bug is fixed or new feature is introduced.
