const conf = require('./commonSettings');

module.exports = {
    "label": "ScenarioTitle",
    "tags": [],
    "referenceUrl": conf.refhost,
    "url": conf.testhost,
    "hideSelectors": [],
    "removeSelectors": [],
    "selectors": [],
    "readyEvent": null,
    "delay": conf.delay,
    "misMatchThreshold" : conf.misMatchThreshold,
    "onBeforeScript": "onBefore.js",
    "onReadyScript": "onReady.js"  
}