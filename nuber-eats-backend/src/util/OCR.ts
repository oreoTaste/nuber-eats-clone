import { Injectable } from '@nestjs/common';
import { Worker, createWorker } from 'tesseract.js';

@Injectable()
export class OCR {
    /*
    How to use :
    1. constructor
    constructor(private readonly appService: AppService, private readonly ocr: OCR) {}
    2. use in method
    let rslt = await this.ocr.getTextFromPic('./eng_bw.png');
    */
    private worker : Worker;
    constructor(){
        createWorker().then(el => this.worker = el);
    }
    async close() {
        this.worker.terminate();
    }
    async getTextFromPic(path : string) : Promise<string>{
        let text = "";
        await this.worker.loadLanguage('eng+kor');
        await this.worker.initialize('eng+kor');
    
        await this.worker.recognize(path).then(el => text = el.data.text);
        return text;
    };
}
