# BRACCO

Bracco is a simple runner of [BackstopJS](https://github.com/garris/BackstopJS) for visual regression testing.

You can easly **split, manage and run your scenarios**

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
        scenario: string,
        tags: [array]
    }
```

The second argument test is a bool flag if you want run test task after the reference task is finished.


### **test(options[Object])**
Test task of backstopJS.

`options[Object]`
```javascript
    {
        scenario: string,
        tags: [array]
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
const bracco = require('bracco');

bracco.init({
    testhost: "https://www.amazon.it/",
    refhost: "https://www.amazon.co.uk/"
});

bracco.reference({
    scenario: 'footer'
});

bracco.test({
    scenario: 'footer'
});
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
                '#main'
            ],
            "selectors": [
                "#siteFooter"
            ],
            "onBeforeScript": "footer/onBefore.js",
            "onReadyScript": "footer/onReady.js"
        }]
    };
```



`casper_scripts/footer/onReady.js`
```javascript
module.exports = function (casper, scenario, vp) {
  
    casper.waitForSelector('footer', function() {
      this.scrollToBottom();
    });

  console.log('onReady.js has run for: ', vp.name);
};
```