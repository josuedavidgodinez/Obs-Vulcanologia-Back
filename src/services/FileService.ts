import * as fs from "fs";
import * as path from "path";
import { date2number } from "./TimeService";

const dirchar = process.env.DIRCHAR? process.env.DIRCHAR : '/';

/**
 * Crear un folder si no existe
 * @param folder Path del folder a crear
 * @returns 
 */
export const createFolderIfNotExists = async(folder: string): Promise<boolean> => {
    try{
        await fs.promises.access(folder);
        return false;
    }catch{
        await fs.promises.mkdir(folder);
        return true;
    }
}
/**
 * Verificar si un folder existe a partir de una ruta
 * @param filePath Path del folder 
 * @returns True si existe ,False si no existe
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
    try{
        await fs.promises.access(filePath);
        return true;
    }catch{
        return false;
    }
}
/**
 * Escribir en un archivo segun un path y otros parametros
 * @param path Path completo del archivo a escribir
 * @param text Texto que se escribira en el archivo
 * @param append True si se quiere adjuntar la informacion y False si se va a sobrescribir el archivo
 */
export const writeFile = async (path: string, text: string, append: boolean): Promise<void> => {
    const exist = await fileExists(path);
    if (exist && append) await fs.promises.appendFile(path, text);
    else await fs.promises.writeFile(path, text);
}
/**
 * Borar un archivo
 * @param path path del archivo que se desea eliminar
 */
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
/**
 * Leer archivo completamente a partir de un path
 * @param path Path completo del archivo
 * @returns Devuelve el contenido del archivo
 */
export const readFile = async (path:string): Promise<string> => {
    const exist = await fileExists(path);
    if (!exist) throw new Error("File not exists");
    const content = await rf(path);
    return content;
}
/**
 * Buscar un archivo de python en la rutas destinada de archivos de Python
 * @param scriptname Nombre del archivo de Python
 * @returns Devuelve path completo del archivo en Python
 */
export const getPyScript = (scriptname:string) => {
    return path.resolve('./src/pyscripts/' + scriptname + '.py');
}
/**
 * Obtiene el folder destinado para almacenamiento de archivos de la 
 * logica del sistema (folder a partir del .env)
 * @returns Devuelve el path del folder
 */
export const getObsPyDataFolder = async (): Promise<string> => {
    const folder = process.env.OBSPYDATA? process.env.OBSPYDATA : '.' + dirchar +'obspydata';
    const r = await createFolderIfNotExists(folder);
    if(r) console.log(folder + ' created');
    return folder;
}
/**
 * Obtener el folder destinado para imagenes a partir del .env
 * @returns Devuelve el path completo de las imagenes
 */
export const getImageFolder = async (): Promise<string> => {
    const folder = process.env.IMGFOLDER? process.env.IMGFOLDER : '.' + dirchar +'obspydata';
    const r = await createFolderIfNotExists(folder);
    if(r) console.log(folder + ' created');
    return folder;
}
/**
 * Obtener el folder destinado para archivos txt temporales que guarde las rutas ya sea de miniseeds o imagenes
 * ya que runPy trabaja en consola y no puede devolver todos los datos de las rutas por el tamanio
 *  por lo que se opto por guardarlas en un txt temporal para ser leidas
 * @returns Devuelve el path completo de las rutas almacenadas en el txt
 */
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

/**
 * Generar archivo temporal txt para guardar las rutas de los miniseeds o de las imagenes
 * @param text text con el contenido de las rutas
 * @returns devuelve el path completo del archivo temporal .txt
 */
export const genTempFile = async (text: string): Promise<string> => {
    const id = randId() + '_' + date2number(new Date());
    const path = await getTempFolder() + id + '.txt';
    return path;
}
export const a2msFolder = process.env.ATOMS? process.env.ATOMS : '.' + dirchar +'ascii2miniseed';
export const TEMPFolder = process.env.TEMPFOLDER? process.env.TEMPFOLDER : '.' + dirchar +'obspydata';

export const getImgPrueba = () => {
    return path.resolve('./src/public/imagen_prueba.png')
}