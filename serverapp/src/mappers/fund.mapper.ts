import * as moment from "moment";
import { FundInstance } from "../models/Types/Fund";
import { FundDTO } from "./Types/Fund";

export class FundMapper {
  public mapFull(data: FundInstance): FundDTO {
    return;
  }

  public async mapItem(data: FundInstance): Promise<FundDTO> {
    return await {
      id: data.id || null,
      name: data.name || null,
      notes: data.description || null
    };
  }
}
