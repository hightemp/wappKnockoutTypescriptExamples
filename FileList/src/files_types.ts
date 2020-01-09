
import __aFilesTypes from './types.json'

export interface IFileType {
    name: string;
    title: string;
    type: string[];
    iLastModified?: number;
    bOpened?: boolean;
}

var aFilesTypes: IFileType[] = __aFilesTypes;

export {
    aFilesTypes
}