"use strict";

// libs
const globby = require('globby');
const _ = require('lodash');
const backstop = require('backstopjs');
const path = require('path');
const jsonfile = require('jsonfile');

// settings
const defaultSettings = require('./conf/commonSettings');
const defaultScenario = require('./conf/defaultScenario');
const defaultConfig = require('./conf/defaultConfig');


const bracco = {

    init(settings) {
        //setup vars (testhost, refhost, settings..)
        this.conf = Object.assign({}, defaultSettings, settings);
    },

    buildConfig(options) {
        let scenarios = [];
        let tags = [];
        let conf = this.conf;

        // read tags option
        if(Array.isArray(options.tags)) {

            if(options.tags.length > 0) {
                tags = tags.concat(options.tags);
            }
            
        } else if(options.tags !== '' && options.tags) {
            tags.push(options.tags);
        }

        // build path for globby
        let root = path.normalize(process.cwd());
        let pathScenario = (options.hasOwnProperty('scenario')) ? root + '/scenarios/' + options.scenario + '/*.js' : root + '/scenarios/**/*.js';

        // get scenarios from js files
        globby.sync([pathScenario]).map(e => {
            let getScenario = require(e);
            let newScenarios = [];

            if(tags.length > 0) {

                getScenario(conf)
                    .filter(scenario => scenario.hasOwnProperty('tags'))
                    .map(scenario => {

                        scenario.tags.map(cTag => {
                            let match = _.findIndex(tags, o => o === cTag );
                            if(match !== -1) { 
                                newScenarios.push(Object.assign({}, defaultScenario, scenario));
                            }
                        });

                });

            } else {

                newScenarios = getScenario(conf).map(scenario => Object.assign({}, defaultScenario, scenario));

            }

            scenarios = scenarios.concat(newScenarios);  
        });

        // merge with default config of backstop
        let config = Object.assign({}, defaultConfig);

        // add scenario to config
        config.scenarios = config.scenarios.concat(scenarios);
        
        // write config in dafault backstop json
        let jsonFile = root + '/backstop.json';
        jsonfile.writeFileSync(jsonFile, config);
    },

    reference(options, test) {

        this.buildConfig(options);

        backstop('reference')
            .then(() => {
                if(test) {
                    backstop('test');
                }
            }).catch((err) => {
                console.log("Error: ", err);
            });

    },

    test(options) {

        this.buildConfig(options);

        backstop('test');
    }

};


module.exports = bracco;