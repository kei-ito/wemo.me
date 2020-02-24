export interface Phrase<TType> {
    en: TType,
    ja: TType,
}
export type Language = keyof Phrase<string>;
export type StaticPhrase = Phrase<string>;
export type DynamicPhrase<TProps> = Phrase<(props: TProps) => string>;
