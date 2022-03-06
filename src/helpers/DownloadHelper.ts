import Papa from "papaparse";
import FileSaver from "file-saver";
import { Buffer } from "buffer"
import JSZip from "jszip";
import * as XLSX from "xlsx";
import * as fs from "fs";

export class UploadHelper {

  static createCsv(data: Object[]) {

  }

  static createXlsx(data: Object[]) {

  }

  static getFile(files: FileList, fileName: string) {
    for (let i = 0; i < files.length; i++) if (files[i].name === fileName) return files[i];
    return null;
  }

  static readBinary(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => { resolve(reader.result.toString()); };
      reader.onerror = () => { reject(new DOMException("Error reading image")) }
      reader.readAsArrayBuffer(file);
    });
  }

  static readImage(files: FileList, photoUrl: string) {
    return new Promise<string>((resolve, reject) => {
      let match = false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === photoUrl) {
          const reader = new FileReader();
          reader.onload = () => { resolve(reader.result.toString()); };
          reader.onerror = () => { reject(new DOMException("Error reading image")) }
          reader.readAsDataURL(files[i]);
        }
      }
      if (match) reject(new DOMException("Did not find image"));
    });
  }

  static getStrippedRecord(r: any) {
    let names = Object.getOwnPropertyNames(r)
    for (let j = names.length - 1; j >= 0; j--) {
      let n = names[j];
      if (r[n] === "") delete r[n];
    }
    return r;
  }

}
