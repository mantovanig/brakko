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
        let conf = this.conf;

        let tags = (options.tags) ? options.tags : false;
        tags = (tags && !Array.isArray(tags)) ? [tags] : tags;

        let labels = (options.labels) ? options.labels : false;
        labels = (labels && !Array.isArray(labels)) ? [labels] : labels;

        let scenarioNames = (options.scenario) ? options.scenario : false;
        scenarioNames = (scenarioNames && !Array.isArray(scenarioNames)) ? [scenarioNames] : scenarioNames;

        // build path for globby
        let root = path.normalize(process.cwd());
        let scenariosPaths = [];

        if (scenarioNames.length > 0) {
            scenariosPaths = scenarioNames.map(e => {
                return root + '/scenarios/' + e + '/*.js'
            })
        } else {
            scenariosPaths.push(root + '/scenarios/**/*.js');
        }

        // get scenarios from js files
        globby.sync(scenariosPaths).map(e => {
            let getScenario = require(e);
            let newScenarios = [];


            if (tags && tags.length > 0) {

                getScenario(conf)
                    .filter(scenario => scenario.hasOwnProperty('tags'))
                    .map(scenario => {

                        scenario.tags.map(cTag => {
                            let match = _.findIndex(tags, o => o === cTag );
                            if (match !== -1) { 
                                newScenarios.push(Object.assign({}, defaultScenario, scenario));
                            }
                        });

                    });

            } else {
                newScenarios = getScenario(conf).map(scenario => Object.assign({}, defaultScenario, scenario));
            }

            if(labels && labels.length > 0) {
                newScenarios = newScenarios
                                    .filter(scenario => scenario.hasOwnProperty('label'))
                                    .filter(scenario => {
                                        return labels.indexOf(scenario.label) === 0
                                    });
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