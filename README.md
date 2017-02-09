# BRAKKO

![Image of Brakko](http://mantovanig.it/media/brakko_readme.jpg)

Brakko is a simple runner of [BackstopJS](https://github.com/garris/BackstopJS) for visual regression testing.

You can easly **split, manage and run your scenarios**

## Installation
```javascript
    npm install brakko --save
```

- Create folder `casper_scripts` with default file onReady.js and onBefore.js - [See doc of BackstopJS](https://github.com/garris/BackstopJS#running-custom-casperjs-scripts)

- Create folder `scenarios` with subfolder and js file for each scenarios - [See file structure](#files-structure)

## Methods

### **init(conf[Object])**

Initialize the runner.

Arguments: the conf object used in your scenario

`conf[Object]`
```javascript
{
    testhost: "https://www.amazon.it/",
    refhost: "https://www.amazon.co.uk/",
    delay: 1000,
    misMatchThreshold: 10    
}
```

### **reference(options[Object], test[Boolean])**

Reference task of backstopJS.

`options[Object]`
```javascript
    {
        scenario: NameOfSubfolder[string/array],
        tags: [string/array],
        labels: [string/array]
    }
```

The second argument test is a bool flag if you want run test task after the reference task is finished.


### **test(options[Object])**
Test task of backstopJS.

`options[Object]`
```javascript
    {
        scenario: NameOfSubfolder[string/array],
        tags: [string/array],
        labels: [string/array]
    }
```

## Files structure
Create in the root of your project a folder named `scenarios` and create subfolder for each group of scenario.

Example:

```
casper_sripts
│   onBefore.js
│   onReady.js
│
└───footer
│   │   onBefore.js
│   │   onReady.js
│
scenarios
│
└───header
│   │   headerAll.js
│   │   headerMenu.js
│   │   headerSearch.js
│   │   ...
│   
└───footer
    │   footerAll.js
    │   footerSocial.js
    │   ...
```


## Basic Usage

`index.js`
```javascript
const brakko = require('brakko');

brakko.init({
    testhost: "https://www.amazon.it/",
    refhost: "https://www.amazon.co.uk/"
});

brakko.reference({
    scenario: 'footer'
}, true);

```

`scenarios/footer/footerAll.js`
```javascript
module.exports = 
    (conf) => {
        return [{
            "label": "FooterAll",
            "tags": ["common"],
            "referenceUrl": conf.refhost,
            "url": conf.testhost,
            "removeSelectors": [
                '#unrec-pageContent'
            ],
            "selectors": [
                ".navFooterCopyright"
            ],
            "misMatchThreshold" : 5,
            "onBeforeScript": "footer/onBefore.js",
            "onReadyScript": "footer/onReady.js"
        }]
    };
```

`casper_scripts/footer/onReady.js`
```javascript
module.exports = function (casper, scenario, vp) {

    casper.waitForSelector('.navFooterCopyright', function() {
      this.scrollToBottom();
    });

  console.log('onReady.js has run for: ', vp.name);
};
```

`casper_scripts/footer/onBefore.js`
```javascript
module.exports = function (casper, scenario, vp) {
  //This script runs before your app loads. Edit here to log-in, load cookies or set other states required for your test.
  console.log('onBefore.js has run for '+ vp.name + '.');
};
```

## TODO
- [x] add label to task cofig
- [x] add the support for multiple scenarios
- [ ] add country to init config
- [ ] yeoman generator