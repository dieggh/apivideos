

import fs, { stat } from 'fs';

const saveFiles = async (base64File: string, fileName: string, ext: string, directory: string, previousFile: string | null = null): Promise<string>  => {

    if(previousFile !== null){
        fs.unlink(`${process.env.FILES_PATH!}/${previousFile}`, (error) =>{
            console.log(error)
        })
    }
  
    return new Promise<string>((resolve, reject) =>{
        
        fs.stat(directory, (err, stats) =>{
            if(err){
                //reject(err);
            }

            if(stats){
                
                const bitmap = decodeBase64ToFile(base64File );
                
                fs.writeFile(`${directory}/${fileName}.${ext}` , bitmap, { encoding: 'base64' }, (err => {

                    if(err){
                        reject(err);
                    }else{
                        
                        resolve(`${directory}/${fileName}.${ext}`);
                    }
            
                }));
            }else{
                fs.mkdir(directory, { recursive: true }, (err) =>{
                    if(err){
                        reject(err);
                    }

                    const bitmap = decodeBase64ToFile(base64File);

                    fs.writeFile(`${directory}/${fileName}.${ext}` , bitmap, { encoding: 'base64' }, (err => {

                        if(err){
                            throw err;
                        }else{
                            resolve(`${directory}/${fileName}.${ext}`);
                        }
                
                    }));
                })
            }
        });
    });
        /*if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }*/

}

const decodeBase64ToFile = ( base64: string  ) : Buffer =>{
            
    const bitmap =  Buffer.from(base64.split(",")[1].toString(), 'base64');    

    return bitmap;
    
}

export { saveFiles };