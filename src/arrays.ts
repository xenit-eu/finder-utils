export type ReadonlyArray2D<T> = ReadonlyArray<ReadonlyArray<T>>;
export const emptyArray = <T>(): ReadonlyArray<T> => [];

export const asImmutable = <T>(array: T[]): ReadonlyArray<T> => array.slice() as ReadonlyArray<T>;

export const flatten = <T>(toFlatten: ReadonlyArray2D<T>): T[] => ([] as T[]).concat(...toFlatten);

export const flatmap = <T, U>(toFlatMap: ReadonlyArray<T>, mapFunction: (e: T) => U[]): U[] =>
    flatten(toFlatMap.map(mapFunction));

export const last = <T>(immutableArray: ReadonlyArray<T>): T | undefined => immutableArray[immutableArray.length - 1];

export const lastMust = <T>(immutableArray: ReadonlyArray<T>): T => {
    const element = last(immutableArray);
    if (element === undefined) {
        throw new Error("Must have a last element");
    }

    return element;
};

export const allButLast = <T>(immutableArray: ReadonlyArray<T>) => immutableArray.slice(0, immutableArray.length - 1);

export const allButFirst = <T>(immutableArray: ReadonlyArray<T>) => immutableArray.slice(1);

export const addElement = <T>(immutableArray: ReadonlyArray<T>, element: T) => immutableArray.concat([element]);

export const replaceLast = <T>(immutableArray: ReadonlyArray<T>, element: T) =>
    addElement(allButLast(immutableArray), element);

export const replaceAt = <T>(immutableArray: ReadonlyArray<T>, element: T, index: number) =>
    immutableArray.slice(0, index)
        .concat([element])
        .concat(immutableArray.slice(index + 1, immutableArray.length));

export const removeAt = <T>(immutableArray: ReadonlyArray<T>, index: number) =>
    immutableArray.slice(0, index)
        .concat(immutableArray.slice(index + 1, immutableArray.length));
export const replaceOrRemoveAt = <T>(immutableArray: ReadonlyArray<T>, element: T | null, index: number) =>
    element === null ? removeAt(immutableArray, index) : replaceAt(immutableArray, element, index);

type PartitionFunction<T> = (element: T, i: number, elements: ReadonlyArray<T>) => string;
type PartitionResult<T> = Partial<Record<string, ReadonlyArray<T> | undefined>>;

export const partition = <T>(array: ReadonlyArray<T>, partitionFn: PartitionFunction<T>): PartitionResult<T> => {
    const ret: PartitionResult<T> = {};

    array.forEach((item, i, items) => {
        const partKey = partitionFn(item, i, items);
        if (ret[partKey] === undefined) {
            ret[partKey] = [];
        }
        // tslint:disable-next-line:no-non-null-assertion
        ret[partKey] = ret[partKey]!.concat([item]);
    });

    return ret;
};

type UniqueIdFunction<T> = (element: T) => string;
type MergeFunction<T> = (a: T, b: T) => T;
const defaultUniqueMergeFunction = <T>(a: T, b: T) => a;
export const unique = <T>(
    array: ReadonlyArray<T>,
    uniqueFn: UniqueIdFunction<T>,
    mergeFn: MergeFunction<T> = defaultUniqueMergeFunction,
): T[] => {
    const parts = partition(array, uniqueFn);

    return Object.keys(parts)
        .map((key: string) => parts[key] as ReadonlyArray<T>)
        .map((sameItems: ReadonlyArray<T>) => sameItems.reduce(mergeFn));
};

export const arrayEquals = <T>(
    a: readonly T[],
    b: readonly T[],
    cmp: (a: T, b: T) => boolean = defaultCompareFunction,
): boolean => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = a.length - 1; i >= 0; i -= 1) {
        if (!cmp(a[i], b[i])) {
            return false;
        }
    }

    return true;
};

type CompareFunction<T> = (a: T, b: T) => boolean;
// tslint:disable-next-line: strict-comparisons
const defaultCompareFunction = <T>(a: T, b: T) => a === b;

export const arrayIntersect = <T>(
    a: ReadonlyArray<T>,
    b: ReadonlyArray<T>,
    cmp: CompareFunction<T> = defaultCompareFunction,
): T[] => a.filter((aItem) => b.filter((bItem) => cmp(aItem, bItem)).length > 0);

export const arrayContainsAll = <T>(
    array: ReadonlyArray<T>,
    items: ReadonlyArray<T>,
    cmp: CompareFunction<T> = defaultCompareFunction,
): boolean => arrayIntersect(array, items, cmp).length === items.length;
