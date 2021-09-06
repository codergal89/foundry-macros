import Nedb from 'nedb'
import path from 'path'
import * as fs from 'fs';
import { Macro } from './lib/Macro'
import './lib/NedbAsync'


/** The directory to use when searching for macro scripts */
const SCRIPT_DIRECTORY = 'module/scripts/macros';

/** The file name of the compendium pack to store the macros in */
const PACK_FILE = 'module/packs/macros.db';

/**
 * Collect all macro scripts
 * 
 * @param directory A directory path to search scripts in
 * @returns A list of macros found in the given directory
 */
function collectMacros(directory: fs.PathLike): Array<Macro> {
    if (!fs.existsSync(directory)) {
        throw new Error('No compiled macros found!');
    }

    return fs.readdirSync(directory)
        .map(entry => `${directory}/${entry}`)
        .filter(entry => fs.lstatSync(entry).isFile())
        .filter(entry => path.parse(entry).ext === '.js')
        .map(entry => new Macro(entry));
}

/**
 * Open the compendium pack to store the macros in.
 * 
 * @param packFile The path to the compendium pack file
 * @returns An NeDB database to use for storing macro entries
 */
function openCompendium(packFile: fs.PathLike): Nedb<Macro> {
    const database = new Nedb<Macro>(packFile as string);
    database.persistence.stopAutocompaction();
    database.loadDatabase();
    return database;
}

/**
 * Update a macro pack with the supplied macros
 * 
 * @param macros A list of macros to put into the database
 * @param pack A database representing the pack
 * @returns The number of updated/inserted documents
 */
async function updateMacroPack(macros: Array<Macro>, pack: Nedb<Macro>): Promise<number> {
    let updates = macros.map(async macro => await pack.asyncUpdate({ name: macro.name }, macro, { upsert: true }));
    let counts = await Promise.all(updates);
    return counts.reduce((acc, num) => acc + num, 0);
}

/**
 * The main function of this script
 */
(async () => {
    let macros = collectMacros(SCRIPT_DIRECTORY);
    let database = openCompendium(PACK_FILE);

    let updates = await updateMacroPack(macros, database);

    console.log(`updated ${updates} macros in the database`);

    await database.asyncCompact();

    console.log(`created pack file at ${PACK_FILE}`);
})();