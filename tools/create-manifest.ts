import * as fs from 'fs';


const MANIFEST_TEMPLATE_FILE = 'module/module.json.in';
const MANIFEST_OUTPUT_FILE = 'module/module.json';
const NPM_PACKAGE_MANIFEST = 'package.json';


interface Manifest {
    version: string
}


function loadFile(filePath: fs.PathLike): object {
    if (!fs.existsSync(filePath)) {
        throw new Error(`No manifest input file found at '${filePath}'`);
    }

    let content = fs.readFileSync(filePath);
    return JSON.parse(content.toString());
}

function writeFile(filePath: fs.PathLike, data: object): void {
    let output = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, output, {mode: 0o644});
}

(() => {
    let template = loadFile(MANIFEST_TEMPLATE_FILE) as Manifest;
    let npmData = loadFile(NPM_PACKAGE_MANIFEST) as Manifest;

    template.version = npmData.version;

    writeFile(MANIFEST_OUTPUT_FILE, template);
})();