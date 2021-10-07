import * as fs from "fs";
import * as path from "path";
import { date2number } from "./TimeService";

const dirchar = process.env.DIRCHAR? process.env.DIRCHAR : '/';

export const createFolderIfNotExists = async(folder: string): Promise<boolean> => {
    try{
        await fs.promises.access(folder);
        return false;
    }catch{
        await fs.promises.mkdir(folder);
        return true;
    }
}
export const fileExists = async (filePath: string): Promise<boolean> => {
    try{
        await fs.promises.access(filePath);
        return true;
    }catch{
        return false;
    }
}
export const writeFile = async (path: string, text: string, append: boolean): Promise<void> => {
    const exist = await fileExists(path);
    if (exist && append) await fs.promises.appendFile(path, text);
    else await fs.promises.writeFile(path, text);
}
export const deleteFile = async (path: string): Promise <void> => {
    const exist = await fileExists(path);
    if (!exist) throw new Error(path + ' no exist');
    await fs.promises.unlink(path);
}
const rf = (path: string): Promise<string> => {
    return new Promise((resolve,reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(data.toString());
          });
     });
}
export const readFile = async (path:string): Promise<string> => {
    const exist = await fileExists(path);
    if (!exist) throw new Error("File not exists");
    const content = await rf(path);
    return content;
}
export const getPyScript = (scriptname:string) => {
    return path.resolve('./src/pyscripts/' + scriptname + '.py');
}
export const getObsPyDataFolder = async (): Promise<string> => {
    const folder = process.env.OBSPYDATA? process.env.OBSPYDATA : '.' + dirchar +'obspydata';
    const r = await createFolderIfNotExists(folder);
    if(r) console.log(folder + ' created');
    return folder;
}
export const getImageFolder = async (): Promise<string> => {
    const folder = process.env.IMGFOLDER? process.env.IMGFOLDER : '.' + dirchar +'obspydata';
    const r = await createFolderIfNotExists(folder);
    if(r) console.log(folder + ' created');
    return folder;
}
const getTempFolder = async (): Promise<string> => {
    const folder = process.env.TEMPFOLDER? process.env.TEMPFOLDER : '.' + dirchar +'obspydata';
    const r = await createFolderIfNotExists(folder);
    if(r) console.log(folder + ' created');
    return folder;
}
const randId = () => {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    for ( var i = 0; i < 16; i++ ) {
        const index = Math.floor(Math.random() * characters.length);
        result += characters[index];
    }
    return result;
}
export const genTempFile = async (text: string): Promise<string> => {
    const id = randId() + '_' + date2number(new Date());
    const path = await getTempFolder() + id + 'txt';
    return path;
}
export const a2msFolder = process.env.ATOMS? process.env.ATOMS : '.' + dirchar +'ascii2miniseed';
export const TEMPFolder = process.env.TEMPFOLDER? process.env.TEMPFOLDER : '.' + dirchar +'obspydata';

export const getImgPrueba = () => {
    return path.resolve('./src/public/imagen_prueba.png')
}