/// <reference path="_references.ts" />

declare var module: NodeModule;
var myScreepsManager: SCREEPSManager;

module.exports.loop = ()=> {
    PathFinder.use(false);
    var myScreepsManager: SCREEPSManager = new SCREEPSManager(
        
    );
    myScreepsManager.main();
}