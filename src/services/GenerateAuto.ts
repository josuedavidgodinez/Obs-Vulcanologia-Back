///Funciones a ejecutar de forma automatica
import { genMiniseeds } from "../services/GenerateMSService";
import { generateImage } from "../services/Generat24HimgService";

const fi = new Date('2020-12-20T00:00:00-06:00');
const ff = new Date('2020-12-21T00:00:00-06:00');

export function Test(): string {
    return "Test"
}

export async function GenerateMSeed(table: string) {
    genMiniseeds(table, fi, ff).then(miniseeds => {
        console.log(JSON.stringify(miniseeds));
    }).catch((err: Error) => {
        console.log(err.message);
    });
}

export async function GetImage(table: string) {
    generateImage(table, ff).then(imgPath => {
        console.log('File created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}