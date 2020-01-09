'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }


var __aFilesTypes = [
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

var aFilesTypes = __aFilesTypes;

var __aFiles = [
	{
		path: "./files/1/file1.png",
		name: "file1.png",
		type: "test1",
		date: "10.10.1990 10:20",
		record_id: "1",
		sign: true
	},
	{
		path: "./files/2/file2.jpeg",
		name: "file2.jpeg",
		type: "test2",
		date: "10.12.2003 11:20",
		record_id: "2",
		sign: false
	},
	{
		path: "./files/3/file3.jpg",
		name: "file3.jpg",
		type: "test3",
		date: "10.11.2010 12:20",
		record_id: "3"
	}
];

var aFiles = __aFiles;

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
            set: function (v) {
                console.log("setter", key, v);
                fnValue(v);
                // fnValue.valueHasMutated!();
                //(<FilesList><unknown>target)
                var oThis = this;
                oThis.fnRefresh();
            },
            enumerable: true
        });
    };
}
var FilesList = /** @class */ (function () {
    function FilesList() {
        // @observable([], )
        this.aGroupedFilesByTypes = [];
        var oThis = this;
        oThis.$oFilesListElement = $("#files-list");
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
        console.log("fnGroupByTypes");
        var oThis = this;
        oThis.aGroupedFilesByTypes = [];
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
                    oFile.oFileType = oFileType;
                    oGroup.aFiles.push(oFile);
                }
            }
            oThis.aGroupedFilesByTypes.push(oGroup);
        }
    };
    FilesList.prototype.fnToggleGroup = function (oFileType) {
        oFileType.bOpened = !oFileType.bOpened;
        $('#files-group-title-' + oFileType.name).toggleClass('closed');
        $('#files-group-block-' + oFileType.name).toggle();
    };
    FilesList.prototype.fnChangeFileType = function (oFile, oFileType) {
        console.log("fnChangeFileType", oFile, oFileType);
    };
    FilesList.prototype.fnDeleteFile = function (oFile) {
        console.log("fnDeleteFile", oFile);
    };
    FilesList.prototype.fnUpdateList = function () {
        var oThis = this;
        oThis.fnGroupByTypes();
    };
    FilesList.prototype.fnBind = function () {
        var oThis = this;
        if (!oThis.$oFilesListElement.length) {
            return;
        }
        oThis.$oFilesListElement.show();
        ko.applyBindings(oThis, oThis.$oFilesListElement[0]);
    };
    FilesList.prototype.fnRefresh = function () {
        var oThis = this;
        ko.cleanNode(oThis.$oFilesListElement[0]);
        ko.applyBindings(oThis, oThis.$oFilesListElement[0]);
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
    var oFilesList = new FilesList();
    oFilesList.fnBind();
})();
