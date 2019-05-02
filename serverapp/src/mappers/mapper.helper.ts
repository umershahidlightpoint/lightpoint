export interface IList {
  data: Array<object>;
  meta: object;
}

export class MapperHelper {
  public async paginate(list: IList, callback) {
    const data = await this.mapList(list.data, callback);
    const meta = await this.parseMeta(list.meta);
    return {
      data,
      meta
    };
  }

  private async mapList(
    array: Array<object>,
    callback
  ): Promise<Array<object>> {
    const arrayList: Promise<Array<object>> = Promise.all(
      array.map(
        async (element: object): Promise<object> => await callback(element)
      )
    );
    return await arrayList;
  }

  private async parseMeta(meta) {
    return await {
      meta
    };
  }
}
