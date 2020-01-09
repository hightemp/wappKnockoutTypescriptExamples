
import __aFiles from './files.json'

export interface IFile {
    path: string;
    name: string;
    type: string;
    date: string;
    record_id: string | number;
    sign?: boolean;
}

var aFiles: IFile[] = __aFiles;

export {
    aFiles
}