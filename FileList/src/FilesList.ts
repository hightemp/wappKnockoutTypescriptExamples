
import * as ko from 'knockout'
import 'jquery/jquery'
import moment from 'moment'

import aFilesTypes from './types.json'
import aFiles from './files.json'

interface File {
    name: string;
    type: string;
}

interface FileType {
    name: string;
    title: string;
    type: string;
    iLastModified: number;
}

interface Group {
    oType: FileType;
    aFiles: File[];
}

function observable<T>(mDefaultValue: T) 
{
    console.log('observable arguments', arguments);

    return <P>(target: P, key: keyof P) => {
        console.log('lambda1: observable arguments', target, key);

        var fnValue: Function;

        if (Array.isArray(mDefaultValue)) {
            fnValue = ko.observableArray(mDefaultValue);
        } else {
            fnValue = ko.observable(mDefaultValue);
        }

        Object.defineProperty(target, 'm_'+key, {
            value: fnValue
        });

        Object.defineProperty(target, key, {
            get: () => fnValue(),
            set: (v) => fnValue(v),
            enumerable: true
        });
    };
}

class FilesList {
    @observable(aFilesTypes)
    aFilesTypes: FileType[];

    @observable(aFiles)
    aFiles: File[];

    @observable("")
    sFilterText: string;

    aGroupedFilesByTypes: Group[] = [];

    constructor() {
        var oThis = this;

        oThis.fnUpdateList();
    }

    fnFormatDateTime(sDateTime: string)
    {
        return moment(sDateTime).format('DD.MM.YYYY hh:mm');
    }

    fnFormatUnixTime(iTimeStamp: number)
    {
        return iTimeStamp ? moment.unix(iTimeStamp).format('DD.MM.YYYY hh:mm') : '';
    }

    fnIsStringIncludeString(sString1: string, sString2: string)
    {
        return !!~sString1.toLowerCase().indexOf(sString2.toLowerCase());
    }

    fnGroupByTypes()
    {
        var oThis = this;

        for (var oFileType of <Array<FileType>><unknown>oThis.aFilesTypes) {
            var oGroup: Partial<Group> = {};
            
            oGroup.aFiles = [];
            oGroup.oType = oFileType;

            oGroup.oType.iLastModified = 0;

            for (var oFile of <any>oThis.aFiles) {
                var sFilterText: string = oThis.sFilterText;
                if (sFilterText) {
                    if (!!oThis.fnIsStringIncludeString((<File>oFile).name, sFilterText)) {
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

            oThis.aGroupedFilesByTypes.push(oGroup as Group);
        }
    }

    fnToggleGroup(sTypeName: string)
    {
        $('#files-group-title-'+sTypeName).toggleClass('closed');
        $('#files-group-block-'+sTypeName).toggle();
    }

    fnUpdateList()
    {
        var oThis = this;

        oThis.fnGroupByTypes();
    }
}

(() => {
    var $oFilesListElement = $("#files-list");

    if (!$oFilesListElement.length) {
        return;
    }

    $oFilesListElement.show();

    var oFilesList = new FilesList();
    console.log('aFiles', oFilesList.aFiles);

    ko.applyBindings(oFilesList, $oFilesListElement[0]);
})();