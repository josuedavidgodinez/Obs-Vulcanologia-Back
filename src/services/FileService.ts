import * as fs from "fs";
import * as path from "path";

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
export const a2msFolder = process.env.ATOMS? process.env.ATOMS : '.' + dirchar +'ascii2miniseed';



//Borrar cuando se cambie a base de datos
const miniseedRegs = async (): Promise<string> => {
    const obspydata = await getObsPyDataFolder();
    return obspydata + 'listams.txt';
}
export const addReg = async (reg:string[]): Promise<void> => {
    const file = await miniseedRegs();
    let text = '';
    reg.forEach(element => {
        text += element + '\n';
    });
    await writeFile(file, text, true);
}
export const getReg = async (): Promise<string[]> => {
    const file = await miniseedRegs();
    const content = await readFile(file);
    return content.split('\n');
}
export const getImgPrueba = () => {
    return path.resolve('./src/public/imagen_prueba.png')
}