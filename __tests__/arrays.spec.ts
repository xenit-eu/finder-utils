import { arrayContainsAll, arrayIntersect, flatmap, flatten, partition, unique } from "../src/arrays";
describe("Array functions", () => {
    it("should run tests", () => {
        expect(true)
            .toBe(true);
    });
    it("should do a proper flatmap", () => {
        expect(flatmap([[1, 2], [3, 4]], (u) => u))
            .toEqual([1, 2, 3, 4]);
    });
    it("should do a proper flatten", () => {
        expect(flatten([[1, 2], [3, 4]]))
            .toEqual([1, 2, 3, 4]);
    });

    it("should do a proper partition", () => {
        expect(partition(["a1", "a2", "a3", "b1", "b2", "b3", "c3"], (elem) => elem[0]))
            .toEqual({
                a: ["a1", "a2", "a3"],
                b: ["b1", "b2", "b3"],
                c: ["c3"],
            });
        expect(partition(["a1", "a2", "a3", "b1", "b2", "b3", "c3"], (elem) => elem[1]))
            .toEqual({
                1: ["a1", "b1"],
                2: ["a2", "b2"],
                3: ["a3", "b3", "c3"],
            });
        expect(partition(["a1", "a2", "a3", "b1", "b2", "b3", "c3"], (_, i) => `${(i % 2)}`))
            .toEqual({
                0: ["a1", "a3", "b2", "c3"],
                1: ["a2", "b1", "b3"],
            });
    });

    describe("unique()", () => {
        it("should make the items in an array unique", () => {
            expect(unique(["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2"], (elem) => elem[0]))
                .toEqual(["a1", "b1", "c1"]);
        });

        it("should keep the ordering of the items in the array", () => {
            expect(unique(["b1", "a2", "a1", "c3", "c1", "b2"], (elem) => elem[0]))
                .toEqual(["b1", "a2", "c3"]);
        });

        it("should allow alternative ways to merge non-unique items together", () => {
            expect(unique(["b1", "a2", "a1", "c3", "c1", "b2"], (elem) => elem[0], (a, b) => a + b))
                .toEqual(["b1b2", "a2a1", "c3c1"]);
        });
    });

    describe("arrayIntersect()", () => {
        it("should return items that are present in both arrays", () => {
            expect(arrayIntersect(["a", "b", "c"], ["c", "b", "d"]))
                .toEqual(["b", "c"]);
        });

        it("should work with a custom compare function", () => {
            expect(arrayIntersect(["a1", "a2", "a3"], ["b1", "b2", "b4"], (a, b) => a[1] === b[1]))
                .toEqual(["a1", "a2"]);
        });
    });

    describe("arrayContainsAll()", () => {
        it("should return true when all items are contained in the array", () => {
            expect(arrayContainsAll(["a", "b", "c"], ["b"]))
                .toBeTruthy();
        });

        it("should return false when not all items arey contained in the array", () => {
            expect(arrayContainsAll(["a", "b", "c"], ["b", "d"]))
                .toBeFalsy();
        });
    });
});
