/**
 * @fileoverview Lint JSON files
 * @author Azeem Bande-Ali
 * @copyright 2015 Azeem Bande-Ali. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var CSSLint = require("csslint").CSSLint;

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


var fileContents = {};

var prepro = {
    preprocess: function(text, fileName) {
        fileContents[fileName] = text;
        return [text];
    },
    postprocess: function(messages, fileName) {
        var result = CSSLint.verify(fileContents[fileName], {"box-model":1,"display-property-grouping":1,"duplicate-properties":1,"empty-rules":1,"known-properties":1,"adjoining-classes":1,"box-sizing":1,"compatible-vendor-prefixes":1,"gradients":1,"text-indent":1,"vendor-prefix":1,"fallback-colors":1,"star-property-hack":1,"underscore-property-hack":1,"bulletproof-font-face":1,"font-faces":1,"import":1,"duplicate-background-images":1,"regex-selectors":1,"universal-selector":1,"unqualified-attributes":1,"zero-units":1,"overqualified-elements":1,"shorthand":1,"floats":1,"font-sizes":1,"ids":1,"important":1,"outline-none":1,"qualified-headings":1,"unique-headings":1});
        var messages = result.messages;
        delete fileContents[fileName];
        
        return messages.map(e => {
            return {
                ruleId: "css/" + e.rule.id,
                severity: e.type == 'error' ? 2 : 1,
                message: e.message.replace(/ at line .*/, ''), // maybe e.rule.desc as well somehow?
                source: e.evidence,
                line: e.line,
                column: e.col,
            };
        });
    }
};

// import processors
module.exports.processors = {
    // add your processors here
    ".css": prepro,
};

