///Funciones a ejecutar de forma automatica
import fetch from 'node-fetch'

export function Test(): string {
    return "Test"
}

export async function GenerateMSedd() {
    const response = await fetch('http://localhost:8080/genMiniseed');
    const body = await response.json();

    console.log('inside cron function ', body);
}

export async function GetImage() {
    const response = await fetch('http://localhost:8080/getImg');
    const body = await response.json();

    console.log('inside cron function ', body);
}