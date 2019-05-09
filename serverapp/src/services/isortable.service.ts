export interface ISortableService {
  sorting(
    sorting_column: string,
    sorting_direction: string,
    default_column: string,
    default_direction: string
  );
}
