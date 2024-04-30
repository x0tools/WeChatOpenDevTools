export interface REG_SZ_Value {
    value: string;
    type: "REG_SZ";
}

export interface REG_EXPAND_SZ_Value {
    value: string;
    type: "REG_EXPAND_SZ";
}

export interface REG_DWORD_Value {
    value: number;
    type: "REG_DWORD";
}

export interface REG_QWORD_Value {
    value: number;
    type: "REG_QWORD";
}

export interface REG_MULTI_SZ_Value {
    value: string[];
    type: "REG_MULTI_SZ";
}

export interface REG_BINARY_Value {
    value: number[];
    type: "REG_SZ";
}

export interface REG_DEFAULT_Value {
    value: string;
    type: "REG_DEFAULT";
}

export type RegistryItemValue = REG_SZ_Value | REG_EXPAND_SZ_Value | REG_DWORD_Value | REG_QWORD_Value | REG_MULTI_SZ_Value | REG_BINARY_Value | REG_DEFAULT_Value;

export interface RegistryItem {
    exists: boolean;
    keys: string[];
    values: {
        [name: string]: RegistryItemValue;
    };
}

export type RegistryItemCollection<T extends readonly string[], U = { [key in T[number]]: RegistryItem }> = U;

export interface RegistryPutItem {
    [name: string]: RegistryItemValue;
}

export type RegistryItemPutCollection = {
    [key: string]: RegistryPutItem;
};

export const OS_ARCH_AGNOSTIC = "A";
export const OS_ARCH_SPECIFIC = "S";
export const OS_ARCH_32BIT = "32";
export const OS_ARCH_64BIT = "64";

type Architecture = (typeof OS_ARCH_AGNOSTIC | typeof OS_ARCH_SPECIFIC | typeof OS_ARCH_32BIT | typeof OS_ARCH_64BIT);
type ErrResCallback<T extends readonly string[]> = (err: Error | undefined, res: RegistryItemCollection<T>) => void;

export function list<K extends string>(keys: readonly K[], callback: ErrResCallback<typeof keys>): void;
export function list<K extends string>(keys: readonly K[], architecture: Architecture, callback?: ErrResCallback<typeof keys>): void;

export function setExternalVBSLocation(newLocation: string): string;

interface ErrorWithCode extends Error {
    code: number;
    description: string;
 }

type ErrCallback = (err: ErrorWithCode | undefined) => void;

export function createKey<K extends string>(keys: readonly K[], callback: ErrCallback): void;
export function createKey<K extends string>(keys: readonly K[], architecture: Architecture, callback?: ErrCallback): void;

export function deleteKey(keys: readonly string[], callback: ErrCallback): void;
export function deleteKey(keys: readonly string[], architecture: Architecture, callback?: ErrCallback): void;

export function putValue(map: RegistryItemPutCollection, callback: ErrCallback): void;
export function putValue(map: RegistryItemPutCollection, architecture: Architecture, callback?: ErrCallback): void;

export namespace arch {
    export function list<K extends string>(keys: readonly K[], callback: ErrResCallback<typeof keys>): void;
    export function list32<K extends string>(keys: readonly K[], callback: ErrResCallback<typeof keys>): void;
    export function list64<K extends string>(keys: readonly K[], callback: ErrResCallback<typeof keys>): void;
    export function createKey(keys: readonly string[], callback: ErrCallback): void;
    export function createKey32(keys: readonly string[], callback: ErrCallback): void;
    export function createKey64(keys: readonly string[], callback: ErrCallback): void;
    export function deleteKey(keys: readonly string[], callback: ErrCallback): void;
    export function deleteKey32(keys: readonly string[], callback: ErrCallback): void;
    export function deleteKey64(keys: readonly string[], callback: ErrCallback): void;
    export function putValue(map: RegistryItemPutCollection, callback: ErrCallback): void;
    export function putValue32(map: RegistryItemPutCollection, callback: ErrCallback): void;
    export function putValue64(map: RegistryItemPutCollection, callback: ErrCallback): void;
}

export namespace promisified {
    export function list<K extends string>(keys: readonly K[]): Promise<RegistryItemCollection<typeof keys>>;
    export function list<K extends string>(keys: readonly K[], architecture: Architecture): Promise<RegistryItemCollection<typeof keys>>;
    export function createKey(keys: readonly string[]): Promise<void>;
    export function createKey(keys: readonly string[], architecture: Architecture): Promise<void>;
    export function deleteKey(keys: readonly string[]): Promise<void>;
    export function deleteKey(keys: readonly string[], architecture: Architecture): Promise<void>;
    export function putValue(map: RegistryItemPutCollection): Promise<void>;
    export function putValue(map: RegistryItemPutCollection, architecture: Architecture): Promise<void>;

    export namespace arch {
        export function list<K extends string>(keys: readonly K[]): Promise<RegistryItemCollection<typeof keys>>;
        export function list32<K extends string>(keys: readonly K[]): Promise<RegistryItemCollection<typeof keys>>;
        export function list64<K extends string>(keys: readonly K[]): Promise<RegistryItemCollection<typeof keys>>;
        export function createKey(keys: readonly string[]): Promise<void>;
        export function createKey32(keys: readonly string[]): Promise<void>;
        export function createKey64(keys: readonly string[]): Promise<void>;
        export function deleteKey(keys: readonly string[]): Promise<void>;
        export function deleteKey32(keys: readonly string[]): Promise<void>;
        export function deleteKey64(keys: readonly string[]): Promise<void>;
        export function putValue(map: RegistryItemPutCollection): Promise<void>;
        export function putValue32(map: RegistryItemPutCollection): Promise<void>;
        export function putValue64(map: RegistryItemPutCollection): Promise<void>;
    }
}
