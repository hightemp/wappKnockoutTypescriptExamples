
import * as ko from 'knockout'
import 'jquery/jquery'

import aFilesTypes from './types.json'
import aFiles from './files.json'

interface File {
    name: string;
    type: string;
}

interface FileType {
    sName: string;
    sType: string;
}

class FileList {
    aFilesTypes = KnockoutObservableArray<FileType>();
    aFiles = KnockoutObservableArray<File>();

    constructor() {
        var oThis = this;

        oThis.aFilesTypes = ko.observable(aFilesTypes);
        oThis.aFiles = ko.observable(aFiles);
    }
}

ko.applyBindings(new FileList());