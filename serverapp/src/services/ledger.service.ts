import { Ledger, Fund, Account, Customer } from "../models";
import { ILedgerForm } from "../form/iledger.form";
import { ILedgerSearchForm } from "../form/iledgersearch.form";
import { ILedgerService } from "./iledger.service";
import { ServiceHelper } from "../helpers/service.helper";
import { RecordNotFoundException } from "../exceptions/record_not_found_exception";
import * as _ from "lodash";

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
        throw new RecordNotFoundException("Fund with this ID not Found.");
      }

      const account = await Account.findByPk(input.account_id);
      if (!account) {
        throw new RecordNotFoundException("Account with this ID not Found.");
      }

      const customer = await Customer.findByPk(input.customer_id);
      if (!customer) {
        throw new RecordNotFoundException("Customer with this ID not Found.");
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

  public edit = async (input: ILedgerForm): Promise<Ledger> => {
    try {
      const currentLedger = await Ledger.findByPk(input.id);
      if (!currentLedger) {
        throw new RecordNotFoundException("Ledger with this ID not Found.");
      }

      const fund = await Fund.findByPk(input.fund_id);
      if (!fund) {
        throw new RecordNotFoundException("Fund with this ID not Found.");
      }

      const account = await Account.findByPk(input.account_id);
      if (!account) {
        throw new RecordNotFoundException("Account with this ID not Found.");
      }

      const customer = await Customer.findByPk(input.customer_id);
      if (!customer) {
        throw new RecordNotFoundException("Customer with this ID not Found.");
      }

      const updatedLedger: Ledger = await Ledger.update(input, {
        where: { id: currentLedger.id }
      });
      const ledger: Ledger = await Ledger.findByPk(currentLedger.id, {
        include: [Fund, Account, Customer]
      });

      return Promise.resolve(ledger);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public search = async (params: ILedgerSearchForm): Promise<IList> => {
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
      const criteria = {};
      if (!_.isEmpty(params.fund_id)) {
        criteria["fund_id"] = params.fund_id;
      }
      if (!_.isEmpty(params.account_id)) {
        criteria["account_id"] = params.account_id;
      }
      if (!_.isEmpty(params.customer_id)) {
        criteria["customer_id"] = params.customer_id;
      }

      const ledgers: Ledger = await Ledger.findAndCountAll({
        ...sorting,
        ...pagination,
        where: {
          ...criteria
        },
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

      if (!ledger) {
        throw new RecordNotFoundException("Record not Found");
      }

      return Promise.resolve(ledger);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
