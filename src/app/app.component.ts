import { Component, ViewChild } from '@angular/core';
import { TesseractWorker } from 'tesseract.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tesseract.js-angular-app';
  ocrResult = '';
  imgUrl = '';

  @ViewChild('overlay', null) overlay;

  constructor() {

  }

  onAttachmentChange(event) {
    this.handleFiles(event.target.files);
  }

  handleFiles(files) {
    if (files && files.length) {
      const reader = new FileReader();
      const [file] = files;

      reader.onload = () => {
        const data: string = reader.result as string;
        this.imgUrl = data;
        this.processImage(data);

      };
      reader.readAsDataURL(file);
    }
  }

  processImage(buffer) {
    const worker = new TesseractWorker();
    worker
      .recognize(buffer, 'deu')
      .progress((p) => {
        const percent = p.progress * 100;
        this.ocrResult = `${p.status}: ${percent}%`;
      })
      .then((result) => {
        console.log(result);
        this.ocrResult = result.text;
        worker.terminate();
      });
  }
}
