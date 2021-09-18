///Funciones a ejecutar de forma automatica

export function Test(): string {
    return "Test"
}

export async function GenerateMSedd(port: string) {
    const response = await fetch(`http://localhost:${port}/genMiniseed`);
    const body = await response.json();

    console.log('inside cron function ', body);
}

export async function GetImage(port: string) {
    const response = await fetch(`http://localhost:${port}/getImg`);
    const body = await response.json();

    console.log('inside cron function ', body);
}