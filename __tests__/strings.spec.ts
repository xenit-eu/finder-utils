import { endsWith } from "../src/strings";
describe("String functions", () => {
    it("check endswith", () => {
        expect(endsWith("test124", "124"))
            .toEqual(true);
        expect(endsWith("test124", "123"))
            .toEqual(false);
    });
});
