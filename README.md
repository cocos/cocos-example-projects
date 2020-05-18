# Cocos Creator 3D Example cases

## show-cases

1. scenes/ambient: ambient lighting
2. scenes/audio: audio system baseline test
3. scenes/blade-storm: animation events, particle effect on joint sockets
4. scenes/collision-detection: simple collision detection
5. scenes/custom-effect: custom shader
6. scenes/helmet: PBR material showcase, skybox
7. scenes/instanced-skinning: massive skinning models using GPU instancing
8. scenes/jellyfish: animation, transparent material, simple prefab instantiation
9. scenes/knight: animation, light
10. scenes/particle-compare: various particle effects
11. scenes/pbr: PBR baseline
12. scenes/physics: rigidbody physics simulation
13. scenes/shadertoy: simple example on importing shadertoy resources
14. scenes/shadows: planar shadow demo
15. scenes/skin: pre-integrated SSS demo
16. scenes/sponza: multiple render target, particle effects, spot lights
17. scenes/tangents: glTF tangent space data conformance test
18. scenes/toon: NPR baseline
19. scenes/winter: particle system, emitter editing

## simple-games

1. lobby: lobby for all simple games.
2. simple-shooting: a simple shooting game demo.
3. simple-run: a simple parkour game demo.

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
