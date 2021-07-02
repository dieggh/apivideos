"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const saveFiles = (base64File, fileName, directory, previousFile = null) => __awaiter(void 0, void 0, void 0, function* () {
    if (previousFile !== null) {
        fs_1.default.unlink(`${process.env.FILES_PATH}/${previousFile.replace('dist/public', '')}`, (error) => {
            console.log(error);
        });
    }
    return new Promise((resolve, reject) => {
        fs_1.default.stat(directory, (err, stats) => {
            if (err) {
                //reject(err);
            }
            if (stats) {
                const bitmap = decodeBase64ToFile(base64File);
                fs_1.default.writeFile(`${directory}/${fileName}`, bitmap, { encoding: 'base64' }, (err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(`${directory}/${fileName}`);
                    }
                }));
            }
            else {
                fs_1.default.mkdir(directory, { recursive: true }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    const bitmap = decodeBase64ToFile(base64File);
                    fs_1.default.writeFile(`${directory}/${fileName}`, bitmap, { encoding: 'base64' }, (err => {
                        if (err) {
                            throw err;
                        }
                        else {
                            resolve(`${directory}/${fileName}`);
                        }
                    }));
                });
            }
        });
    });
    /*if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }*/
});
exports.saveFiles = saveFiles;
const decodeBase64ToFile = (base64) => {
    const bitmap = Buffer.from(base64.split(",")[1].toString(), 'base64');
    return bitmap;
};
