# CS559-Three -  a version of the THREE.js library for CS559 Workbooks

**This is the Spring23 version!**

These files are taken from the THREE distribution. 

They are the pieces that are required for the CS559 workbooks. This is the minimum.
If you want other things (like the sources or the documentations or examples), download the entire three package.

This archive was created by downloading three.js-master on January 10, 2023.
It is THREE version **148**.

The version of THREE for class is in the [2023 CS 559 Three Repo](https://github.com/CS559/CS559-Three23). 

The choices of files are based on last year (which might not be an informed choice).

What's here (all copied from the THREE distribution):
1. The Three README.md and LICENSE files (renamed)
1. `build/three.module.js`
1. the src folder (mainly to get the typing information)
1. some of the examples (not all of them) - all from the jsm folder
    - controls (in the past, it was a subset - this year I included more)
    - curves
    - libs
    - loaders
    - webxr
1. the fonts (just the json for helvetiker) - this was added later in the semester

## Type Information

The `build/types` folder is copied from this [repository](https://github.com/three-types/three-ts-types). 

The following steps were taken:
1. copied `index.d.ts` and renamed it to `three.module.d.ts`
2. copy `src` and renamed it to `types`
3. edit `three.module.d.ts` to refer to `types` (rather than `src`)

This has not yet been tested fully... A few of the demos do work.

Note: step 3 (editing the files to point to the right thing) was not an elegant approach.
In the future, we should use the library "as is" and then use an "import map" to load things
correctly.  (see https://threejs.org/docs/index.html#manual/en/introduction/Installation "Addons")