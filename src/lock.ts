// tslint:disable: max-classes-per-file
export class Lock {
    private locked: number = 0;

    public withLock<T>(callback: () => T): T {
        if (this.isLocked()) {
            throw new LockedError(this);
        }
        return this.lockDuring(callback);
    }

    public isLocked(): boolean {
        return this.locked !== 0;
    }

    public ifUnlocked<T>(callback: () => T): T | null {
        if (!this.isLocked()) {
            return callback();
        }
        return null;
    }

    public lockDuring<T>(callback: () => T): T {
        this.locked++;
        try {
            return callback();
        } finally {
            this.locked--;
        }
    }
}

export class LockedError extends Error {
    public constructor(public lock: Lock) {
        super("Lock is locked");
    }

}
