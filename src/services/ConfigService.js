import { app } from 'electron';
import path from 'path';
import fs from 'fs';

const CONFIG_DATA_PATH = app.isPackaged ? path.join(process.resourcesPath, 'extraResources','config.json') : 'src/config.json';

const readConfigData = () => {
    try {
        const data = fs.readFileSync(CONFIG_DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch(error) {
        console.log('Error retrieving user data', error);
        // you may want to propagate the error, up to you
        return null;
    }
}

const writeConfigData = (data) => {
    fs.writeFileSync(CONFIG_DATA_PATH, JSON.stringify(data));
}

export {
  readConfigData,
  writeConfigData
}
