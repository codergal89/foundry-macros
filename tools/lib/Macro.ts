import path from 'path'
import * as fs from 'fs';


export class Macro {
    readonly command: string
    readonly name: string
    readonly img: string

    readonly folder: string = ''
    readonly permission: object = { default: 0 }
    readonly scope: string = 'global'
    readonly sort: number = 0
    readonly type: string = 'script'

    constructor(filePath: fs.PathLike) {
        let filename = path.parse(filePath as string).name;
        this.name = filename.split('-')
            .map(word => `${word[0].toUpperCase()}${word.substr(1)}`)
            .join(' ');
        this.command = fs.readFileSync(filePath).toString();

        this.img = this.command.split('\n')
            .filter(line => line.startsWith('/// ICON:'))
            .slice(0, 1)
            .flatMap(line => line.split(':'))
            .slice(-1)
            .map(line => line.trim())[0] || 'icons/tools/smithing/crucible.webp';
    }
}