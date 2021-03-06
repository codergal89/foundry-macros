import * as fs from 'fs';
import { execSync } from 'child_process';


const MANIFEST_TEMPLATE_FILE = 'module/module.json.in';
const MANIFEST_OUTPUT_FILE = 'module/module.json';
const NPM_PACKAGE_MANIFEST = 'package.json';

const GITHUB_RELEASE_URL_BASE = 'https://github.com/codergal89/foundry-macros/releases/download'


interface Manifest {
    download: string
    manifest: string
    version: string
}

function determineReleaseURL(artifact: string): string {
    let tag = execSync('git tag --points-at HEAD').toString().trim();

    if(!tag.length || tag === 'latest') {
        return `${GITHUB_RELEASE_URL_BASE}/latest/${artifact}`;
    }
    return `${GITHUB_RELEASE_URL_BASE}/${tag}/${artifact}`;
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

    template.download = determineReleaseURL('module.zip');
    template.manifest = determineReleaseURL('module.json');
    template.version = npmData.version;

    writeFile(MANIFEST_OUTPUT_FILE, template);
})();