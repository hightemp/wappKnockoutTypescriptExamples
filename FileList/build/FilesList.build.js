'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ko = require('knockout');
require('jquery/jquery');
var moment = _interopDefault(require('moment'));

var aFilesTypes = [
	{
		name: "test1",
		title: "Описание группы 1",
		type: [
			"test1"
		]
	},
	{
		name: "test2",
		title: "Описание группы 2",
		type: [
			"test2",
			"test2.2"
		]
	},
	{
		name: "test3",
		title: "Описание группы 3",
		type: [
			"test3"
		]
	},
	{
		name: "test4",
		title: "Описание группы 4",
		type: [
			"test4"
		]
	},
	{
		name: "test5",
		title: "Описание группы 5",
		type: [
			"test5"
		]
	},
	{
		name: "test6",
		title: "Описание группы 6",
		type: [
			"test6"
		]
	}
];

var aFiles = [
	{
		path: "./files/1/file1.png",
		type: "test1",
		date: "10.10.1990 10:20"
	},
	{
		path: "./files/2/file2.jpeg",
		type: "test2",
		date: "10.12.2003 11:20"
	},
	{
		path: "./files/3/file3.jpg",
		type: "test3",
		date: "10.11.2010 12:20"
	}
];

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function observable(mDefaultValue) {
    console.log('observable arguments', arguments);
    return function (target, key) {
        console.log('lambda1: observable arguments', target, key);
        var fnValue;
        if (Array.isArray(mDefaultValue)) {
            fnValue = ko.observableArray(mDefaultValue);
        }
        else {
            fnValue = ko.observable(mDefaultValue);
        }
        Object.defineProperty(target, 'm_' + key, {
            value: fnValue
        });
        Object.defineProperty(target, key, {
            get: function () { return fnValue(); },
            set: function (v) { return fnValue(v); },
            enumerable: true
        });
    };
}
var FilesList = /** @class */ (function () {
    function FilesList() {
        this.aGroupedFilesByTypes = [];
        var oThis = this;
        oThis.fnUpdateList();
    }
    FilesList.prototype.fnFormatDateTime = function (sDateTime) {
        return moment(sDateTime).format('DD.MM.YYYY hh:mm');
    };
    FilesList.prototype.fnFormatUnixTime = function (iTimeStamp) {
        return iTimeStamp ? moment.unix(iTimeStamp).format('DD.MM.YYYY hh:mm') : '';
    };
    FilesList.prototype.fnIsStringIncludeString = function (sString1, sString2) {
        return !!~sString1.toLowerCase().indexOf(sString2.toLowerCase());
    };
    FilesList.prototype.fnGroupByTypes = function () {
        var oThis = this;
        for (var _i = 0, _a = oThis.aFilesTypes; _i < _a.length; _i++) {
            var oFileType = _a[_i];
            var oGroup = {};
            oGroup.aFiles = [];
            oGroup.oType = oFileType;
            oGroup.oType.iLastModified = 0;
            for (var _b = 0, _c = oThis.aFiles; _b < _c.length; _b++) {
                var oFile = _c[_b];
                var sFilterText = oThis.sFilterText;
                if (sFilterText) {
                    if (!!oThis.fnIsStringIncludeString(oFile.name, sFilterText)) {
                        continue;
                    }
                }
                if (~oFileType.type.indexOf(oFile.type)) {
                    if (oFile.date) {
                        oGroup.oType.iLastModified = Math.max(oGroup.oType.iLastModified, moment(oFile.date).unix());
                    }
                    oGroup.aFiles.push(oFile);
                }
            }
            oThis.aGroupedFilesByTypes.push(oGroup);
        }
    };
    FilesList.prototype.fnToggleGroup = function (sTypeName) {
        $('#files-group-title-' + sTypeName).toggleClass('closed');
        $('#files-group-block-' + sTypeName).toggle();
    };
    FilesList.prototype.fnUpdateList = function () {
        var oThis = this;
        oThis.fnGroupByTypes();
    };
    __decorate([
        observable(aFilesTypes)
    ], FilesList.prototype, "aFilesTypes", void 0);
    __decorate([
        observable(aFiles)
    ], FilesList.prototype, "aFiles", void 0);
    __decorate([
        observable("")
    ], FilesList.prototype, "sFilterText", void 0);
    return FilesList;
}());
(function () {
    var $oFilesListElement = $("#files-list");
    if (!$oFilesListElement.length) {
        return;
    }
    $oFilesListElement.show();
    var oFilesList = new FilesList();
    console.log('aFiles', oFilesList.aFiles);
    ko.applyBindings(oFilesList, $oFilesListElement[0]);
})();
