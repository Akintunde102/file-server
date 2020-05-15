import fs from 'fs';
import dotenv from 'dotenv';
import { getFiles } from '../util';
dotenv.config();

console.log(process.env.IMAGES_FOLDER_PATH, process.env.IMAGES_INDEX);

const imagesArr = getFiles(process.env.IMAGES_FOLDER_PATH);

const imageDict = {};

for (let index = 0; index < imagesArr.length; index++) {
  const partialFilePath = imagesArr[index];

  const [imageNumber] = partialFilePath.split('.');

  imageDict[imageNumber] = partialFilePath;
}

const dataToStore = `export const index = ${JSON.stringify(imageDict)}; \r\n \r\n export default index;`;

fs.writeFile(process.env.IMAGES_INDEX, dataToStore, function (err) {
  if (err) throw err; console.log('Data Stored');
});

console.log(getFiles(process.env.IMAGES_FOLDER_PATH));


