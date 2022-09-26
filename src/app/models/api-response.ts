export interface ApiResponse<T> {
  response: T;
}

export type EntityName =
  | 'airlines'
  | 'airports'
  | 'cities'
  | 'countries'
  | 'fleets'
  | 'flights'
  | 'taxes'
  | 'timeszones';
