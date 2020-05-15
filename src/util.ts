import fs from 'fs';

function getFiles(folderPath){
    const files = fs.readdirSync(folderPath);
    console.log(files);
    return files;
}

function smartLog(data){
    console.log(data);
}

export {
    getFiles,
    smartLog
};