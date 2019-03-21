export const endsWith = (toTest: string, end: string) =>
    toTest.substring(toTest.length - end.length, toTest.length) === end;
