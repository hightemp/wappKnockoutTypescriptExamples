
import __aFiles from './files.json'

import { IFileType } from './files_types'

export interface IFile {
    path: string;
    name: string;
    type: string;
    date: string;
    record_id: string | number;
    sign?: boolean;
    oFileType?: IFileType; 
}

var aFiles: IFile[] = __aFiles;

export {
    aFiles
}