import fetch from 'node-fetch';
import md5 from 'js-md5';
import fs from 'fs/promises';

const getVersion = async () => {
    const response = await fetch('https://registry.npmjs.org/alcex-static/latest');
    const data = await response.json();
    return data.version;
};

const update = async () => {
    const version = await getVersion();
    const verArray = version.split('.');
    verArray[2] = verArray[2].split('-')[0];

    if (verArray[2] < 9) {
        verArray[2] = String(Number(verArray[2]) + 1);
    } else if (verArray[1] < 9) {
        verArray[1] = String(Number(verArray[1]) + 1);
        verArray[2] = '0';
    } else {
        verArray[0] = String(Number(verArray[0]) + 1);
        verArray[1] = '0';
        verArray[2] = '0';
    }

    const newVersion = `${verArray.join('.')}-${md5(`${Date.now()}${verArray.join('.')}`)}`;
    console.log(newVersion);

    const packageJsonFile = await fs.readFile('./package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonFile);
    packageJson.version = newVersion;
    const newPackage = JSON.stringify(packageJson, null, 2);
    await fs.writeFile('./package.json', newPackage);
    console.log('Complete!!');
};

update();
