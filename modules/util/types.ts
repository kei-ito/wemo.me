export type Brand<TType, TBrand> = TType & {__goat: TBrand};
export interface ITypeChecker<TType> {
    name: string,
    (input: any): input is TType,
}
export interface ITypeFilter<TType> {
    name: string,
    (input: any): TType,
}
