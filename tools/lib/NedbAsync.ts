import Nedb from 'nedb'

declare global {
    interface Nedb {
        asyncCompact(): Promise<void>;
        asyncUpdate(query: object, update: object, options?: Nedb.UpdateOptions): Promise<number>;
    }
}

Nedb.prototype.asyncCompact = async function (): Promise<void> {
    let promise = new Promise<void>((resolve, _) => this.on('compaction.done', resolve));
    this.persistence.compactDatafile();
    return promise;
};

Nedb.prototype.asyncUpdate = async function (query: object, update: object, options?: Nedb.UpdateOptions): Promise<number> {
    return new Promise((resolve, reject) => this.update(query, update, options, (error: Error | null, updateCount: number, _: boolean) => {
        if (error) {
            reject(error);
        } else {
            resolve(updateCount);
        }
    }));
}