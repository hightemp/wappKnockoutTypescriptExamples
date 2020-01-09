
import * as ko from 'knockout'
import 'jquery/jquery'
import moment from 'moment'

import {IFileType, aFilesTypes} from './files_types'
import {IFile, aFiles} from './files'

interface Group {
    oType: IFileType;
    aFiles: IFile[];
}

function observable<T>(mDefaultValue: T) 
{
    console.log('observable arguments', arguments);

    return <P>(target: P, key: keyof P) => {
        console.log('lambda1: observable arguments', target, key);

        var fnValue: KnockoutObservable<any> | KnockoutObservableArray<any>;

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
            set: function (this: FilesList, v) {
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

class FilesList {
    @observable(aFilesTypes)
    aFilesTypes: IFileType[];

    @observable(aFiles)
    aFiles: IFile[];

    @observable("")
    sFilterText: string;

    $oFilesListElement: JQuery;

    // @observable([], )
    aGroupedFilesByTypes: Group[] = [];

    constructor() {
        var oThis = this;

        oThis.$oFilesListElement = $("#files-list");

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
        console.log("fnGroupByTypes");

        var oThis = this;

        oThis.aGroupedFilesByTypes = [];

        for (var oFileType of <Array<IFileType>><unknown>oThis.aFilesTypes) {
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
                    oFile.oFileType = oFileType;
                    oGroup.aFiles.push(oFile);
                }
            }

            oThis.aGroupedFilesByTypes.push(oGroup as Group);
        }
    }

    fnToggleGroup(oFileType: IFileType)
    {
        oFileType.bOpened = !oFileType.bOpened;
        $('#files-group-title-'+oFileType.name).toggleClass('closed');
        $('#files-group-block-'+oFileType.name).toggle();
    }

    fnChangeFileType(oFile: IFile, oFileType: IFileType)
    {
        console.log("fnChangeFileType", oFile, oFileType);
    }

    fnDeleteFile(oFile: IFile)
    {
        console.log("fnDeleteFile", oFile);
    }

    fnUpdateList()
    {
        var oThis = this;

        oThis.fnGroupByTypes();
    }

    fnBind()
    {
        var oThis = this;

        if (!oThis.$oFilesListElement.length) {
            return;
        }

        oThis.$oFilesListElement.show();

        ko.applyBindings(oThis, oThis.$oFilesListElement[0]);
    }

    fnRefresh()
    {
        var oThis = this;

        
        ko.cleanNode(oThis.$oFilesListElement[0]);
        ko.applyBindings(oThis, oThis.$oFilesListElement[0]);
        
        oThis.fnGroupByTypes();
    }
}

(() => {
    var oFilesList = new FilesList();
    oFilesList.fnBind();
})();