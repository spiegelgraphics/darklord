// darklord is an Adobe Illustrator script that creates dark mode copies of your artboards based on a color mapping. 
// Copyright (c) 2022 SPIEGEL-Verlag Rudolf Augstein GmbH & Co. KG
//
// This script uses code taken from the ai2html script by The New York Times, https://github.com/newsdev
// Copyright (c) 2011-2018 The New York Times Company
//
// This script uses code originally written by Markus Ekholm, https://github.com/markusn
// Copyright (c) 2012-2016, Markus Ekholm
//
// This script uses code originally written by Sergey Osokin, https://github.com/creold 
//
// Thank You!
//
// =====================================
// License
// =====================================
// 
// https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 
// =====================================
// How to install darklord
// =====================================
//
// - Move the darklord.js file into the Illustrator folder where scripts are located.
// - For example, on Mac OS X running Adobe Illustrator CC 2022, the path would be: // Adobe Illustrator CC 2014/Presets/en_US/Scripts/darklord-spiegel.js


function main(){

    var scriptVersion = "0.2.1";

    var defaultSettings = {
        "settings_version": scriptVersion,
        "darkmode_background": "#1F1E1C",
        "darkmode_ab_prefix": "dark-",
        "show_completion_dialog_box": true,
        "background_layer_name": "darklord-bg"
    };

    // TODO counter is used for testing; remove before flight
    var counter = 0;

    var feedback = [];
    var warnings = [];
    var errors   = [];
    var startTime = +new Date();
    var doc;
    var docPath;
    var docSettings;
    var scriptDir;
    var colorMapping;
    var documentColorMapping = {};
    var lKey = '%isLocked';
    var hKey = '%isHidden';
    var offset = 50;
    // TODO move tolerance to settings text block
    var tolerance = 3; // tolerance value based on http://zschuessler.github.io/DeltaE/learn/

    try {
        if (!app.documents.length) {
            error('No documents are open');
        }
        if (app.activeDocument.documentColorSpace != DocumentColorSpace.RGB) {
            error('You should change the document color mode to "RGB" before running darklord (File>Document Color Mode>RGB Color).');
        }
        if (app.activeDocument.activeLayer.name == 'Isolation Mode') {
            error('darklord is unable to run because the document is in Isolation Mode.');
        }
        if (app.activeDocument.activeLayer.name == '<Opacity Mask>' && app.activeDocument.layers.length == 1) {
            // TODO: find a better way to detect this condition (mask can be renamed)
            error('darklord is unable to run because you are editing an Opacity Mask.');
        }

        initJSON();

        doc = app.activeDocument;
        docPath = doc.path + "/";
        scriptDir = getFileDirectory($.fileName);

        docSettings = initSpecialTextBlocks();
        docSettings = initDocumentSettings(docSettings);

        colorMapping = readColormap(scriptDir + "/darklord-colormap.json");
        
        runDarklord();
    }
    catch(e) {
        errors.push(formatError(e));
    }

    if (errors.length > 0) {
        showCompletionAlert();
    }
    else if (isTrue(docSettings.show_completion_dialog_box )) {
        message('Script ran in', ((+new Date() - startTime) / 1000).toFixed(1), 'seconds');
        showCompletionAlert();
    }

    function forEach(arr, cb) {
        for (var i=0, n=arr.length; i<n; i++) {
            cb(arr[i], i);
        }
    }

    function filter(arr, test) {
        var filtered = [];
        for (var i=0, n=arr.length; i<n; i++) {
            if (test(arr[i], i)) {
                filtered.push(arr[i]);
            }
        }
        return filtered;
    }

    function extend(o) {
        for (var i=1; i<arguments.length; i++) {
            forEachProperty(arguments[i], add);
        }
        function add(v, k) {
            o[k] = v;
        }
        return o;
    }

    function forEachProperty(o, cb) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                cb(o[k], k);
            }
        }
    }

    function trim(s) {
        return s.replace(/^[\s\uFEFF\xA0\x03]+|[\s\uFEFF\xA0\x03]+$/g, '');
    }
    
    function initJSON() {
        // Minified json2.js from https://github.com/douglascrockford/JSON-js
        // This code is in the public domain.
        // eslint-disable-next-line
        if(typeof JSON!=="object"){JSON={}}(function(){"use strict";var rx_one=/^[\],:{}\s]*$/;var rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rx_four=/(?:^|:|,)(?:\s*\[)+/g;var rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;var rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(n){return n<10?"0"+n:n}function this_value(){return this.valueOf()}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value}var gap;var indent;var meta;var rep;function quote(string){rx_escapable.lastIndex=0;return rx_escapable.test(string)?'"'+string.replace(rx_escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i;var k;var v;var length;var mind=gap;var partial;var value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else if(typeof space==="string"){indent=space}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k;var v;var value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);rx_dangerous.lastIndex=0;if(rx_dangerous.test(text)){text=text.replace(rx_dangerous,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})(); // jshint ignore:line
    }

    /**
     * Gets an array representing the RGB values of an Illustrator color object. NoColor is returned as null.
     * @param {Color} color An Illustrator color object of either type SpotColor, RGBColor, GrayColor or NoColor
     * @returns An array [r,g,b] containing the R, G and B value of the Illustrator color object
     */
    function aiColorToRGBArray(color){
        var r, g, b;
        if(color.typename == 'SpotColor'){
            r = color.spot.color.red;
            g = color.spot.color.green;
            b = color.spot.color.blue;
            spot = true;
        }
        else if(color.typename == 'RGBColor'){
            r = color.red;
            g = color.green;
            b = color.blue;
        }
        else if(color.typename == 'GrayColor') {
            r = g = b = Math.round((100 - color.gray) / 100 * 255);
        }
        else if(color.typename == 'NoColor') {
            return null;
        }
        return [r,g,b];
    }

    function getFileDirectory(filePath) {
        if (filePath.indexOf("/") == -1) {
            return filePath.substring(0, filePath.lastIndexOf('\\'));
        } 
        else {
            return filePath.substring(0, filePath.lastIndexOf('/'));
        }
    }

    // Derive ai2html program settings by merging default settings and overrides.
    function initDocumentSettings(textBlockSettings) {
        var settings = extend({}, defaultSettings); // copy default settings

        // merge settings from text block
        // TODO: consider parsing strings to booleans when relevant, (e.g. "false" -> false)
        if (textBlockSettings) {
            for (var key in textBlockSettings) {
                settings[key] = textBlockSettings[key];
            }
        }
        return settings;
    }
    
    function extendSettings(settings, moreSettings) {
        extend(settings, moreSettings);
    }    

    function warn(msg) {
        warnings.push(msg);
    }
      
    function error(msg) {
        var e = new Error(msg);
        e.name = 'UserError';
        throw e;
    }

    // display debugging message in completion alert box
    // (in debug mode)
    function message() {
        feedback.push(concatMessages(arguments));
    }

    function concatMessages(args) {
        var msg = '', arg;
        for (var i=0; i<args.length; i++) {
            arg = args[i];
            if (msg.length > 0) msg += ' ';
            if (typeof arg == 'object') {
                try {
                    // json2.json implementation throws error if object contains a cycle
                    // and many Illustrator objects have cycles.
                    msg += JSON.stringify(arg);
                } catch(e) {
                    msg += String(arg);
                }
            } else {
                msg += arg;
            }
        }
        return msg;
    }

    function formatError(e) {
        var msg;
        if (e.name == 'UserError') return e.message; // triggered by error() function
        msg = 'RuntimeError';
        if (e.line) msg += ' on line ' + e.line;
        if (e.message) msg += ': ' + e.message;
        return msg;
    }

    // accept inconsistent true/yes setting value
    function isTrue(val) {
        return val == 'true' || val == 'yes' || val === true;
    }

    function stringToLines(str) {
        var empty = /^\s*$/;
        return filter(str.split(/[\r\n\x03]+/), function(line) {
            return !empty.test(line);
        });
    }

    function forEachUsableArtboard(cb, ignoreDark) {
        var ab;
        var numAbs = doc.artboards.length;
        var regex = new RegExp('^[-]' + (ignoreDark ? '|(dark-)' : ''));

        for (var i=0; i<numAbs; i++) {
            ab = doc.artboards[i];
            if(!regex.test(ab.name)) {
                cb(ab, i);
            }
        }
    }

    function readTextFile(path) {
        // This function used to use File#eof and File#readln(), but
        // that failed to read the last line when missing a final newline.
        return readFile(path) || '';
    }

    function readFile(path) {
        var content = null;
        var file = new File(path);
        if (file.exists) {
            file.open('r');
            content = file.read();
            file.close();
        } else {
            alert(path + ' could not be found.');
        }
        return content;
    }

    function readColormap(path) {
        return JSON.parse(readTextFile(path));
    }

    function fileExists(path) {
        return new File(path).exists;
    }

    function straightenCurlyQuotesInsideAngleBrackets(text) {
        // This function's purpose is to fix quoted properties in HTML tags that were
        // typed into text blocks (Illustrator tends to automatically change single
        // and double quotes to curly quotes).
        // thanks to jashkenas
        // var quoteFinder = /[\u201C‘’\u201D]([^\n]*?)[\u201C‘’\u201D]/g;
        var tagFinder = /<[^\n]+?>/g;
        return text.replace(tagFinder, function(tag){
            return straightenCurlyQuotes(tag);
        });
    }

    function straightenCurlyQuotes(str) {
        return str.replace( /[\u201C\u201D]/g , '"' ).replace( /[‘’]/g , "'" );
    }

    function parseSettingsEntry(str) {
        var entryRxp = /^([\w-]+)\s*:\s*(.*)$/;
        var match = entryRxp.exec(trim(str));
        if (!match) {
            return null;
        }
        return [match[1], straightenCurlyQuotesInsideAngleBrackets(match[2])];
    }
    
    // Add ai2html settings from a text block to a settings object
    function parseSettingsEntries(entries, settings) {
        forEach(entries, function(str) {
            var match = parseSettingsEntry(str);
            var key, value;
            if (!match) {
                if (str) {
                    alert("Malformed setting, skipping: " + str);
                }
                return;
            }
            key   = match[0];
            value = match[1];
            
            settings[key] = value;
        });
    }
  
    function parseAsArray(str) {
        str = trim(str).replace( /[\s,]+/g , ',' );
        return str.length === 0 ? [] : str.split(',');
    }

    // Import program settings and custom html, css and js code from specially
    // formatted text blocks
    function initSpecialTextBlocks() {
        var settings = {};

        forEach(doc.textFrames, function(thisFrame) {
            var match, lines;
            if (thisFrame.lines.length > 1) {
                if(thisFrame.lines[0].contents.indexOf('ai2html-settings') < 0) {
                    return;
                }
            }
            lines = stringToLines(thisFrame.contents);
            lines.shift(); // remove header
            // Reset the name of any non-settings text boxes with name ai2html-settings
            parseSettingsEntries(lines, settings);
        });
        return settings;
    }

    // Show alert
    function showCompletionAlert() {
        var rule = "\n================\n";
        var alertText, alertHed;

        if (errors.length > 0) {
            alertHed = "The Script Was Unable to Finish";
        } else {
            alertHed = "You have turned to the dark side.\nMay your graphics guide us through the night.\n";
        }
        alertText = makeList(errors, "Error", "Errors");
        alertText += makeList(warnings, "Warning", "Warnings");
        alertText += makeList(feedback, "Information", "Information");
        alertText += "\n";

        alertText += rule + "darklord-spiegel v" + scriptVersion;
        alert(alertHed + alertText);

        function makeList(items, singular, plural) {
            var list = "";
            if (items.length > 0) {
                list += "\r" + (items.length == 1 ? singular : plural) + rule;
                for (var i = 0; i < items.length; i++) {
                    list += "\u2022 " + items[i] + "\r";
                }
            }
            return list;
        }
    }

    /**
     * Convert any input data to a number
     * @param {string} str - input data
     * @param {number} def - default value if the input data don't contain numbers
     * @return {number}
     */
    function convertToNum(str, def) {
        // Remove unnecessary characters
        str = str.replace(/,/g, '.').replace(/[^\d.]/g, '');
        // Remove duplicate Point
        str = str.split('.');
        str = str[0] ? str[0] + '.' + str.slice(1).join('') : '';
        if (isNaN(str) || str.length == 0) return parseFloat(def);
        return parseFloat(str);
    }

    /**
     * Collect items
     * @param {object} obj - collection of items
     * @param {array} arr - output array with childrens
     */
    function getItems(obj, arr) {
        for (var i = 0, len = obj.length; i < len; i++) {
            var currItem = obj[i];
                try {
                switch (currItem.typename) {
                    case 'GroupItem':
                        arr.push(currItem);
                        getItems(currItem.pageItems, arr);
                        break;
                    default:
                        arr.push(currItem);
                        break;
                }
            } catch (e) {}
        }
    }

    /**
     * Save information about locked & hidden pageItems & layers
     * @param {object} _layers - the collection of layers
     * @param {string} lKey - keyword for locked items
     * @param {string} hKey - keyword for hidden items
     */
    function saveItemsState(_layers, lKey, hKey) {
        var allItems = [];
        for (var i = 0, len = _layers.length; i < len; i++) {
            var currLayer = _layers[i];
            if (currLayer.layers.length > 0) {
                saveItemsState(currLayer.layers, lKey, hKey);
            }
            getItems(currLayer.pageItems, allItems);
            for (var j = 0, iLen = allItems.length; j < iLen; j++) {
                var currItem = allItems[j];
                if (currItem.locked) {
                    currItem.locked = false;
                    currItem.note += lKey;
                }
                if (currItem.hidden) {
                    currItem.hidden = false;
                    currItem.note += hKey;
                }
            }
        }
        redraw();
    }

    /**
     * Remove keyword from Note in Attributes panel
     * @param {object} _layers - the collection of layers
     * @param {string} lKey - keyword for locked items
     * @param {string} hKey - keyword for hidden items
     */
    function removeNote(_layers, lKey, hKey) {
        var regexp = new RegExp(lKey + '|' + hKey, 'gi');
        for (var i = 0, len = _layers.length; i < len; i++) {
            var currLayer = _layers[i],
            allItems = [];
            if (currLayer.layers.length > 0) {
                removeNote(currLayer.layers, lKey, hKey);
            }
            try {
                getItems(currLayer.pageItems, allItems);
                for (var j = 0, iLen = allItems.length; j < iLen; j++) {
                    var currItem = allItems[j];
                    currItem.note = currItem.note.replace(regexp, '');
                }
            } catch (e) {}
        }
    }

    /**
     * Unlock all Layers & Sublayers
     * @param {object} _layers - the collection of layers
     */
    function unlockLayers(_layers) {
        for (var i = 0, len = _layers.length; i < len; i++) {
            if (_layers[i].locked) {
                _layers[i].locked = false;
            }
            if (_layers[i].layers.length) {
                unlockLayers(_layers[i].layers);
            }
        }
    }

    /**
     * Restoring locked & hidden pageItems & layers
     * @param {object} _layers - the collection of layers
     * @param {string} lKey - keyword for locked items
     * @param {string} hKey - keyword for hidden items
     */
    function restoreItemsState(_layers, lKey, hKey) {
        var allItems = [],
        regexp = new RegExp(lKey + '|' + hKey, 'gi');
        for (var i = 0, len = _layers.length; i < len; i++) {
            var currLayer = _layers[i];
            if (currLayer.layers.length > 0) {
                restoreItemsState(currLayer.layers, lKey, hKey);
            }
            getItems(currLayer.pageItems, allItems);
            for (var j = 0, iLen = allItems.length; j < iLen; j++) {
                var currItem = allItems[j];
                if (currItem.note.match(lKey) != null) {
                    currItem.note = currItem.note.replace(lKey, '');
                    currItem.locked = true;
                }
                if (currItem.note.match(hKey) != null) {
                    currItem.note = currItem.note.replace(hKey, '');
                    currItem.hidden = true;
                }
            }
        }
    }

    function getDarkTargetLayer(layer){
        var targetLayer;
        try{
            targetLayer = doc.layers.getByName(docSettings.darkmode_ab_prefix + layer.name);
        }
        catch(e){
            targetLayer = doc.layers.add();
            targetLayer.name = docSettings.darkmode_ab_prefix + layer.name;
            // TODO correctly mirror nested layer structures
            // if(layer.parent.typename == 'Layer'){
            //     targetLayer.move(getDarkTargetLayer(layer.parent), ElementPlacement.PLACEAFTER);
            // }
            // else{
            //     targetLayer.move(layer, ElementPlacement.PLACEAFTER);
            // }
            targetLayer.move(layer, ElementPlacement.PLACEAFTER);
        }
        return targetLayer;
    }

    /**
     * Duplicate all items
     * @param {object} collection - selected items on active artboard
     * @return {array} arr - duplicated items
     */
    function getDuplicates(collection) {
        var arr = [];
        for (var i = 0, len = collection.length; i < len; i++) {
            var dup = collection[i].duplicate();
            // TODO: mirror layer structure for darkmode elements
            // var targetLayer = getDarkTargetLayer(collection[i].layer);
            // dup.move(targetLayer, ElementPlacement.PLACEATEND);
            arr.push(dup);
        }
        return arr;
    }

    function getDarkColor(color){
        var rgb, darkColor;
        rgb = darkColor = aiColorToRGBArray(color);
        if (rgb == null){
            return color;
        }

        if (rgb in documentColorMapping) {
            darkColor = documentColorMapping[rgb];
        }
        else {
            counter++;
            for (var i = 0; i < colorMapping.length; i++) {
                var c = hexToRGB(colorMapping[i].light);
                var diff = deltaE00(c, rgb);
                if (diff <= tolerance) {
                    darkColor = hexToRGB(colorMapping[i].dark);
                }
            }
            documentColorMapping[rgb] = darkColor;
        }

        if (color.typename == 'SpotColor') {
            return newTint(darkColor, 1 - (color.tint / 100));
        }
        return newRGBColor(darkColor);
    }

    /**
     * Applies the dark mode color map
     * @param {array} collection - the collection with objects for applying the dark mode color mapping to
     */
    function recolorArtwork(collection){
        for (var i = 0; i < collection.length; i++){
            try {
                switch (collection[i].typename) {
                    case 'TextFrame':
                        if(collection[i].textRange.length > 0) {
                            var ps = collection[i].textRange.paragraphs;
                            for (var j = 0; j < ps.length; j++) {
                                if(ps[j].characters.length > 0){
                                    ps[j].fillColor = getDarkColor(ps[j].fillColor);
                                    ps[j].strokeColor = getDarkColor(ps[j].strokeColor);
                                }
                            }
                        }
                        break;
                    case 'PathItem':
                        collection[i].fillColor = getDarkColor(collection[i].fillColor);
                        collection[i].strokeColor = getDarkColor(collection[i].strokeColor);
                        break;
                    case 'CompoundPathItem':
                        recolorArtwork(collection[i].pathItems);
                        break;
                    case 'GroupItem':
                        recolorArtwork(collection[i].pageItems);
                        break;
                }
            }
            catch(e){
                continue;
            }
        }
    }

    /**
     * Converts a HEX RGB string to decimal RGB values
     * @param {string} hex A HEX Color string #RRGGBB or RRBBGG
     * @returns An array shaped [r,g,b] containing decimal RGB color values
     */
    function hexToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
         ] : null;
    }
    
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(rgb) {
        return componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
    }

    /**
     * A function to convert RGB color values to LAB color values
     * @param {array} rgb An array shaped [r,g,b] containing RGB values
     * @returns An array shaped [l,a,b] containing LAB values
     */
    function rgbToLab(rgb){
        var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
        y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
        z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
    }

    /**
     * A function to convert LAB color values to RGB color values
     * @param {array} lab An array shaped [l,a,b] containing LAB values
     * @returns An array shaped [r,g,b] containing RGB values
     */
    function labToRgb(lab) {
        var y = (lab[0] + 16) / 116, x = lab[1] / 500 + y, z = y - lab[2] / 200, r, g, b;
        x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
        y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
        z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);
        r = x *  3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y *  1.8758 + z *  0.0415;
        b = x *  0.0557 + y * -0.2040 + z *  1.0570;
        r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
        g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
        b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;
        return [Math.max(0, Math.min(1, r)) * 255, Math.max(0, Math.min(1, g)) * 255, Math.max(0, Math.min(1, b)) * 255];
    }

    /**
     * CIE Delta E 2000 Color-Difference algorithm (CIEDE2000)
     * @param {array} rgb1 An array shaped [r,g,b] containing RGB values
     * @param {array} rgb2 An array shaped [r,g,b] containing RGB values
     * @returns The color difference
     */
    function deltaE00(rgb1,rgb2)
    {
        /**
        * Implemented as in "The CIEDE2000 Color-Difference Formula:
        * Implementation Notes, Supplementary Test Data, and Mathematical Observations"
        * by Gaurav Sharma, Wencheng Wu and Edul N. Dalal.
        */
        var lab1 = rgbToLab(rgb1);
        var lab2 = rgbToLab(rgb2);

        // Get L,a,b values for color 1
        var L1 = lab1[0];
        var a1 = lab1[1];
        var b1 = lab1[2];

        // Get L,a,b values for color 2
        var L2 = lab2[0];
        var a2 = lab2[1];
        var b2 = lab2[2];

        // Weight factors
        var kL = 1;
        var kC = 1;
        var kH = 1;

        /**
        * Step 1: Calculate C1p, C2p, h1p, h2p
        */
        var C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2)) //(2)
        var C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2)) //(2)

        var a_C1_C2 = (C1+C2)/2.0; //(3)

        var G = 0.5 * (1 - Math.sqrt(Math.pow(a_C1_C2 , 7.0) / (Math.pow(a_C1_C2, 7.0) + Math.pow(25.0, 7.0)))); //(4)

        var a1p = (1.0 + G) * a1; //(5)
        var a2p = (1.0 + G) * a2; //(5)

        var C1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2)); //(6)
        var C2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2)); //(6)

        var h1p = hp_f(b1, a1p); //(7)
        var h2p = hp_f(b2, a2p); //(7)

        /**
        * Step 2: Calculate dLp, dCp, dHp
        */
        var dLp = L2 - L1; //(8)
        var dCp = C2p - C1p; //(9)

        var dhp = dhp_f(C1,C2, h1p, h2p); //(10)
        var dHp = 2*Math.sqrt(C1p*C2p)*Math.sin(radians(dhp)/2.0); //(11)

        /**
        * Step 3: Calculate CIEDE2000 Color-Difference
        */
        var a_L = (L1 + L2) / 2.0; //(12)
        var a_Cp = (C1p + C2p) / 2.0; //(13)

        var a_hp = a_hp_f(C1,C2,h1p,h2p); //(14)
        var T = 1-0.17*Math.cos(radians(a_hp-30))+0.24*Math.cos(radians(2*a_hp))+
        0.32*Math.cos(radians(3*a_hp+6))-0.20*Math.cos(radians(4*a_hp-63)); //(15)
        var d_ro = 30 * Math.exp(-(Math.pow((a_hp-275)/25,2))); //(16)
        var RC = Math.sqrt((Math.pow(a_Cp, 7.0)) / (Math.pow(a_Cp, 7.0) + Math.pow(25.0, 7.0)));//(17)
        var SL = 1 + ((0.015 * Math.pow(a_L - 50, 2)) /
        Math.sqrt(20 + Math.pow(a_L - 50, 2.0)));//(18)
        var SC = 1 + 0.045 * a_Cp;//(19)
        var SH = 1 + 0.015 * a_Cp * T;//(20)
        var RT = -2 * RC * Math.sin(radians(2 * d_ro));//(21)
        var dE = Math.sqrt(Math.pow(dLp /(SL * kL), 2) + Math.pow(dCp /(SC * kC), 2) +
        Math.pow(dHp /(SH * kH), 2) + RT * (dCp /(SC * kC)) *
        (dHp / (SH * kH))); //(22)
        return dE;
    }
     
    /**
     * CIEDE2000 HELPER FUNCTIONS
     */
    function degrees(n) {
        return n*(180/Math.PI);
    }

    function radians(n) {
        return n*(Math.PI/180);
    }

    function hp_f(x,y) //(7)
    {
        if(x === 0 && y === 0) {
            return 0;
        }
        else {
            var tmphp = degrees(Math.atan2(x,y));
            if(tmphp >= 0){
                return tmphp;
            }
            else {
                return tmphp + 360;
            }
        }
    }

    function dhp_f(C1, C2, h1p, h2p) //(10)
    {
        if(C1*C2 === 0){
            return 0;
        }
        else if(Math.abs(h2p-h1p) <= 180) {
            return h2p-h1p;
        }
        else if((h2p-h1p) > 180) {
            return (h2p-h1p)-360;
        }
        else if((h2p-h1p) < -180) {
            return (h2p-h1p)+360;
        }
        else {
            throw(new Error());
        }
    }

    function a_hp_f(C1, C2, h1p, h2p) { //(14)
        if(C1*C2 === 0) {
            return h1p+h2p
        }
        else if(Math.abs(h1p-h2p)<= 180) {
            return (h1p+h2p)/2.0;
        }
        else if((Math.abs(h1p-h2p) > 180) && ((h1p+h2p) < 360)) {
            return (h1p+h2p+360)/2.0;
        }
        else if((Math.abs(h1p-h2p) > 180) && ((h1p+h2p) >= 360)) {
            return (h1p+h2p-360)/2.0;
        }
        else {
            throw(new Error());
        }
    }

    function makeDarker(rgb, percentage) {
        var lab = rgbToLab(rgb);
        lab[0] -= lab[0] * percentage;
        lab[0] = lab[0] < 0 ? 0 : lab[0];
        return labToRgb(lab);
    }

    function makeBrighter(rgb, percentage) {
        var lab = rgbToLab(rgb);
        lab[0] += lab[0] * percentage;
        lab[0] = lab[0] > 100 ? 100 : lab[0];
        return labToRgb(lab);
    }
    
    function newTint(rgb, tint){
        return newRGBColor([
            rgb[0] + (255 - rgb[0]) * tint,
            rgb[1] + (255 - rgb[1]) * tint,
            rgb[2] + (255 - rgb[2]) * tint
        ]);
    }

    /**
     * Factory method for the Illustrator RGBColor class
     * @param {number} r The red value between 0 and 255
     * @param {number} g The green value between 0 and 255
     * @param {number} b The blie value between 0 and 255
     * @returns An Illustrator RGBColor object
     */
    function newRGBColor(rgb) {
        var color = new RGBColor();
        color.red = rgb[0];
        color.green = rgb[1];
        color.blue = rgb[2];
        return color;
    }

    /**
     * Duplicate the selected artboard. Based on the idea of @Silly-V
     * @param {number} thisAbIdx - current artboard index
     * @param {object} items - collection of items on the artboard
     * @param {number} spacing - distance between copies
     * @param {string} prefix - copy name prefix
     * @param {number} counter - current copy number
     */
     function duplicateArtboard(thisAbIdx, items, spacing, prefix) {
        var thisAb = doc.artboards[thisAbIdx],
            thisAbRect = thisAb.artboardRect,
            abHeight = thisAbRect[1] - thisAbRect[3];

        var newAb = doc.artboards.add(thisAbRect);

        newAb.artboardRect = [
            thisAbRect[0],
            thisAbRect[3] - spacing,
            thisAbRect[2],
            thisAbRect[3] - spacing - abHeight
        ];

        newAb.name = prefix + thisAb.name;

        var docCoordSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM,
        abCoordSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM,
        isDocCoords = app.coordinateSystem == docCoordSystem,
        dupArr = getDuplicates(items);
        
        // generate BG rect
        var bgLayer;
        try{
            bgLayer = doc.layers.getByName(docSettings.background_layer_name);
        }
        catch(e){
            bgLayer = doc.layers.add();
            bgLayer.name = docSettings.background_layer_name;
            bgLayer.zOrder(ZOrderMethod.SENDTOBACK);
        }
        var bgRect = bgLayer.pathItems.rectangle(
            newAb.artboardRect[1] + 1, // top
            newAb.artboardRect[0] - 1, // left
            newAb.artboardRect[2] - newAb.artboardRect[0] + 2, // width
            newAb.artboardRect[1] - newAb.artboardRect[3] + 2 // height
        );
        bgRect.name = "bg_" + thisAb.name;

        var rgb = hexToRGB(docSettings.darkmode_background ? docSettings.darkmode_background : "1F1E1C");
        bgRect.strokeColor = new NoColor();
        bgRect.fillColor = newRGBColor(rgb);
        
        recolorArtwork(dupArr);

        // Move copied items to the new artboard
        for (var i = 0, dLen = dupArr.length; i < dLen; i++) {
            var pos = isDocCoords ? dupArr[i].position : doc.convertCoordinate(dupArr[i].position, docCoordSystem, abCoordSystem);
            dupArr[i].position = [pos[0], pos[1] - (abHeight + spacing)];
        }
    }

    function deleteArtboardContents(abIndex) {
        doc.artboards.setActiveArtboardIndex(abIndex);
        doc.selectObjectsOnActiveArtboard();
        var abItems = doc.selection;

        for (var i = 0; i < abItems.length; i++){
            abItems[i].remove();
        }
    }

    function runDarklord() {
        // check for existing darkmode artwork
        var darkmodeArtboards = [];
        forEachUsableArtboard(function(ab,i){
            if(ab.name.indexOf(docSettings.darkmode_ab_prefix) >= 0){
                darkmodeArtboards.push(i);
            }
        });

        if(darkmodeArtboards.length > 0){
            if(!confirm("Warning!\nProceeding recreates all darkmode artwork, discarding all changes made to the previously generated darkmode versions of your graphics.\n\nDo you want to continue?")) {
                return;
            }
            // reset start time after awaiting user input
            startTime = +new Date();
            for(var i = darkmodeArtboards.length - 1; i >= 0; i--){
                deleteArtboardContents(darkmodeArtboards[i]);
                activeDocument.artboards[darkmodeArtboards[i]].remove();
            }
            for(var i = doc.layers.length - 1; i >= 0; i--){
                if(doc.layers[i].name.indexOf(docSettings.darkmode_ab_prefix) == 0){
                    doc.layers[i].remove();
                }
            }
        }

        var userView = doc.views[0].screenMode;

        forEachUsableArtboard(function(ab,i){
            doc.artboards.setActiveArtboardIndex(i);

            doc.selection = null;
            removeNote(doc.layers, lKey, hKey); // Сlear Note after previous run
            saveItemsState(doc.layers, lKey, hKey);
            unlockLayers(doc.layers);

            // Copy Artwork
            doc.selectObjectsOnActiveArtboard();
            var abItems = doc.selection;
            try {
                duplicateArtboard(i, abItems, offset, 'dark-', i)
            } catch (e) {
                alert(e);
            }

            // Restore locked & hidden pageItems
            restoreItemsState(doc.layers, lKey, hKey);
            doc.selection = null;
            doc.views[0].screenMode = userView;
            app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
        });
        
        // TODO counter is used for testing; remove before flight
        warn("documentColorMap extended: " + counter.toString());
    }
}

main();