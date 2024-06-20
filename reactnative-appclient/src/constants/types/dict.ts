
export interface TranslateBing {
    advanced_translate: string[][];
    advanced_translate_type: string[];
    phonetic_symbol: {
        phonetic_us: string;
        phonetic_us_sort: string;
        phonetic_uk: string;
        phonetic_uk_sort: string;
        phonetic_us_length: number;
    };
    plural_form: string[][];
    sample_images: any;
    synonyms: string[][];
    synonyms_type: string[];
    voice_files: {
        [key: string]: any;
    };
    word: string;
    word_sort: string;
    word_translation: string[][];
}

export interface WordInfo {
    id: number;
    is_delete: number;
    language: string;
    last_time: string;
    phonetic_uk: string;
    phonetic_uk_length: number;
    phonetic_uk_sort: string;
    phonetic_us: string;
    phonetic_us_length: number;
    phonetic_us_sort: string;
    read: number;
    read_count: number;
    read_time: number;
    time: string;
    translate_bing: TranslateBing;
    word: string;
    word_length: number;
    word_sort: string;
}

export interface GroupMapItem {
    id: number,
    read_count: number,
    read_time: number
}

export interface GroupMapItem {
    id: number,
    uid?: number;
    group_map: number[][];
    updatedAt?: string;
    read_count: number,
    read_time: number
}

export interface Dictlist {
    diff?: [];
    group_map?: GroupMapItem[];
    group_words?: GroupMapItem[];
}

export interface GroupItemAttr {
    __typename: string;
    name: string;
    namespace: string;
    publishedAt: string;
    wcount: number;
    wlink: any[];
}

export interface GroupItem {
    __typename: string;
    attributes: GroupItemAttr;
    id: string;
}
export type GroupList = GroupItem[];