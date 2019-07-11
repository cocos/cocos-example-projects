# Examples for Cocos3D

## demo01

1. scenes/helmet: PBR material, skybox
2. scenes/jellyfish: Animation, transparent material, simple prefab instantiation
3. scenes/knight: Animation, light
4. scenes/physics: Physics
5. scenes/sponza: Rendering, particle system, light
6. scenes/winter: Particle system, emitter editing

## demo02

1. scenes/anim: Animation
2. scenes/audio: Audio
3. scenes/head
4. scenes/pbr: PBR rendering test
5. scenes/phong: Phong lighting
6. scenes/shadows: Shadow test

## simple-fps

A really simple and lame fps shooting game demo

## Contribution

For future contributer and maintainers, please apply to the same rigorous examination and documentation style as we have established so far.

It is the only way for us to reach far.

Every 'unpleasant surprise' encountered along the road is a big deal:

Either something is not working, or some designed feature is far less intuitive than what the designer thought it would.

So make sure to do all the followings:

* try to classify the problem: is it editor-related or engine-originated? Which module(s) were involved?
* file an [issue](https://www.github.com/cocos-creator/3d-tasks/issues) to the relevant team
* If it is a bug, clearly [document](#Documents) it in code(usually near your temporary workaround) with the issue number.
* If it is a feature(or lack of one) and looks/feels strange/awkward no matter how you design the relevant system, make sure to write it down in the issue ticket with detailed explaination on your design decisions and why the engine API is not a good fit.
* Remove all the workaround or temporary designs once the bug is fixed or new feature is introduced.

## Documents

If you are making new **assumptions or conventions**, or something is known not to work perfectly as expected(**known caveats**), make sure to add them here in this README.

If some bug is forcing you to do some hacking, workaround, or any kind of strange logic that is not immediately comprehensible, be sure to add clear explanation comments at obvious places nearby.