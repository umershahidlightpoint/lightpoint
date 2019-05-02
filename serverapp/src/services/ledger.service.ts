import { Ledger, Fund, Account, Customer } from "../models";
import { ILedgerForm, ISearchForm } from "../form/iledger.form";
import { ILedgerService } from "./iledger.service";
import { ServiceHelper } from "../helpers/service.helper";
import { RuntimeExceptions } from "../exceptions/runtime_exceptions";

interface IList {
  data: Array<Ledger>;
  meta: object;
}

export class LedgerService implements ILedgerService {
  public serviceHelper: ServiceHelper = new ServiceHelper();

  public create = async (input: ILedgerForm): Promise<Ledger> => {
    try {
      const fund = await Fund.findByPk(input.fund_id);
      if (!fund) {
        throw new RuntimeExceptions("Fund with this ID not Found.", 404);
      }

      const account = await Account.findByPk(input.account_id);
      if (!account) {
        throw new RuntimeExceptions("Account with this ID not Found.", 404);
      }

      const customer = await Customer.findByPk(input.customer_id);
      if (!customer) {
        throw new RuntimeExceptions("Customer with this ID not Found.", 404);
      }

      const currentLedger: Ledger = await Ledger.create(input);
      const ledger: Ledger = await Ledger.findByPk(currentLedger.id, {
        include: [Fund, Account, Customer]
      });

      return Promise.resolve(ledger);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public search = async (params: ISearchForm): Promise<IList> => {
    try {
      const result: IList = { data: [], meta: {} };
      const keyword: string = params.keyword ? params.keyword : "";
      const sorting = this.serviceHelper.sorting(
        params.sort,
        params.sort_direction,
        "value",
        "ASC"
      );
      const pagination = this.serviceHelper.pagination(params.page);

      const ledgers: Ledger = await Ledger.findAndCountAll({
        ...sorting,
        ...pagination,
        include: [Fund, Account, Customer]
      });

      const meta = this.serviceHelper.meta(
        ledgers.count,
        params.page,
        pagination.limit
      );

      result.data = ledgers.rows;
      result.meta = meta;
      return Promise.resolve(result);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public findById = async (id: number): Promise<Ledger> => {
    try {
      const ledger: Ledger = await Ledger.findByPk(id, {
        include: [Fund, Account, Customer]
      });
      return Promise.resolve(ledger);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
