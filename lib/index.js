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

var json_parse = require("./json_parse.js");

var lineColumn = require('line-column');

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
        try {
            json_parse(fileContents[fileName]);
            delete fileContents[fileName];
            return [];
        } catch (e) {
            delete fileContents[fileName];
            var index = lineColumn(e.text, e.at-1);
            var srcLine = e.text.split('\n')[index.line - 1];

            return [{
                ruleId: "invalid-json-" + e.message
                    .toLowerCase()
                    .replace(/\ba\b/g, '')
                    .replace(/[^a-z ]/g, '')
                    .trim()
                    .replace(/\s+/g, '-'),
                severity: 2,
                message: e.message,
                source: srcLine,
                line: index.line,
                column: index.col,
            }];
        }
    }
};

// import processors
module.exports.processors = {
    // add your processors here
    ".json": prepro,
    ".sublime-settings": prepro,
    ".sublime-keymap": prepro,
};

