import { statusCode } from "./statusCode";

export class responseObject {
    status: statusCode;
    content: any;
    constructor(status: statusCode, content: any){
        this.status = status;
        this.content = content;
    }
}