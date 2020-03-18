import { Lock, LockedError } from "../src/lock";

describe("Lock", () => {
    describe("#withLock()", () => {
        it("Calls the lock callback", () => {
            const lock = new Lock();

            const lockCallback = jest.fn();

            lock.withLock(lockCallback);

            expect(lockCallback).toBeCalledTimes(1);
        });

        it("Is locked in the withLock callback", () => {
            const lock = new Lock();

            lock.withLock(() => {
                expect(lock.isLocked()).toBe(true);
            });
        });

        it("Throws when a new lock is attempted while the lock is held", () => {
            const lock = new Lock();

            expect(() => {
                lock.withLock(() => {
                    lock.withLock(() => { /* empty */ });
                });
            }).toThrowError(new LockedError(lock));
        });

        it("Unlocks when an exception is thrown from within the lock function", () => {
            const lock = new Lock();

            try {
                lock.withLock(() => {
                    throw new Error("Failure from #withLock()");
                })
            } catch (e) {
                if (e instanceof Error && e.message === "Failure from #withLock()") {
                    // swallow expected error
                } else {
                    throw e;
                }
            }

            expect(lock.isLocked()).toBe(false);
        });
    });

    describe("#lockDuring()", () => {
        it("Locks the lock during the execution of the callback", () => {
            const lock = new Lock();
            lock.lockDuring(() => {
                expect(lock.isLocked()).toBe(true);
            });
        });

        it("Keeps the lock locked during nested executions of the callback", () => {
            const lock = new Lock();

            lock.lockDuring(() => {
                lock.lockDuring(() => {
                    expect(lock.isLocked()).toBe(true);
                })
                expect(lock.isLocked()).toBe(true);
            });
        })
    });

    describe("#ifUnlocked()", () => {
        it("Calls the callback when unlocked", () => {
            const lock = new Lock();

            const lockCallback = jest.fn();

            lock.ifUnlocked(lockCallback);

            expect(lockCallback).toBeCalledTimes(1);
        });

        it("Does not call the callback when locked", () => {
            const lock = new Lock();

            const lockCallback = jest.fn();

            lock.withLock(() => {
                lock.ifUnlocked(lockCallback);
            });

            expect(lockCallback).not.toHaveBeenCalled();
        })
    })

});
