'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var CSSLint = require('csslint').CSSLint;

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

var settings = {};

var fileContents = {};

var defaultOptions = {
    'box-model': 1,
    'display-property-grouping': 1,
    'duplicate-properties': 1,
    'empty-rules': 1,
    'known-properties': 1,
    'adjoining-classes': 1,
    'box-sizing': 1,
    'compatible-vendor-prefixes': 1,
    'gradients': 1,
    'text-indent': 1,
    'vendor-prefix': 1,
    'fallback-colors': 1,
    'star-property-hack': 1,
    'underscore-property-hack': 1,
    'bulletproof-font-face': 1,
    'font-faces': 1,
    'import': 1,
    'duplicate-background-images': 1,
    'regex-selectors': 1,
    'universal-selector': 1,
    'unqualified-attributes': 1,
    'zero-units': 1,
    'overqualified-elements': 1,
    'shorthand': 1,
    'floats': 1,
    'font-sizes': 1,
    'ids': 1,
    'important': 1,
    'outline-none': 1,
    'qualified-headings': 1,
    'unique-headings': 1
};

function getSetting(ruleId, badRules, type) {
    if (!settings) {
        return type == 'error' ? 2 : 1;
    }
    var setting = settings[ruleId];
    // unset, use default
    if (setting === undefined) { // will never be null in a reasonable case so undefined is ok
        return type == 'error' ? 2 : 1;
    }
    // manually disabled
    if (setting === 0 || setting == 'off') {
        return null; // will filter out e.severity === null later on
    }
    // warn (level 1)
    if (setting === 1 || setting == 'warn') {
        return settings[ruleId] = 1;
    }
    // error (level 2)
    if (setting === 2 || setting == 'error') {
        return settings[ruleId] = 2;
    }
    
    // no return, must have bad property value
    badRules.push({
        ruleId: 'bad-css-rule-' + ruleId,
        severity: 2,
        message: 'Invalid CSSLint rule setting "' + setting + '" for "css/' + ruleId + '", must be one of 0/1/2/off/warn/error',
        source: '<none>',
        line: 1,
        column: badRules.length,
    });
    return type == 'error' ? 2 : 1;
}

var prepro = {
    preprocess: function(text, fileName, config) {
        if (config) { // extended ESLint support, see https://github.com/uwx/eslint
            settings = config.settings.css;
        }

        fileContents[fileName] = text;
        return [text];
    },
    postprocess: function(messages, fileName) {
        var result = CSSLint.verify(fileContents[fileName], defaultOptions);
        var amessages = result.messages;
        delete fileContents[fileName];

        var badRules = [];
        var ruleId = '';
        var setting = -1;
        
        return amessages.map(e => {
            ruleId = e.rule.id;
            setting = getSetting(ruleId, badRules, e.type);
            return {
                ruleId: ruleId,
                severity: setting,
                message: e.message.replace(/ at line .*/, ''), // maybe e.rule.desc as well somehow?
                source: e.evidence,
                line: e.line,
                column: e.col,
            };
        }).filter(e => e.severity !== null).concat(badRules);
    }
};

// import processors
module.exports.processors = {
    // add your processors here
    '.css': prepro,
};
