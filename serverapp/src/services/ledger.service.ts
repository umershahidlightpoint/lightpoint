import * as Sequelize from "sequelize";
import { Ledger, Fund, Account, Customer, AccountType } from "../models";
import { ILedgerForm } from "../form/iledger.form";
import { ILedgerSearchForm } from "../form/iledgersearch.form";
import { ILedgerGroupForm } from "../form/iledgergroup.form";
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

      const params = {
        value: input.value,
        effective_date: input.effectiveDate,
        customer_id: input.customer_id,
        account_id: input.account_id,
        fund_id: input.fund_id
      };

      const currentLedger: Ledger = await Ledger.create(params);
      const ledger: Ledger = await this.findById(currentLedger.id);
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

      currentLedger.customer_id = input.customer_id;
      currentLedger.account_id = input.account_id;
      currentLedger.fund_id = input.fund_id;
      currentLedger.value = input.value;
      currentLedger.effective_date = input.effectiveDate;

      await currentLedger.save();
      const ledger: Ledger = await this.findById(currentLedger.id);

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
        "effective_date",
        "DESC"
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
      if (_.isNumber(_.toNumber(params.value)) && params.value > 0) {
        //criteria["value"] = { Sequelize.Op.gte: _.toNumber(params.value) };
      }

      const ledgers: Ledger = await Ledger.findAndCountAll({
        ...sorting,
        ...pagination,
        where: {
          ...criteria
        },
        include: [
          Fund,
          Customer,
          {
            model: Account,
            include: [{ model: AccountType, as: "accountType" }]
          }
        ]
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

  public group = async (input: ILedgerGroupForm): Promise<IList> => {
    try {
      const result: IList = { data: [], meta: {} };
      const pagination = this.serviceHelper.pagination(input.page);
      let group_by = {};
      if (input.group_by === "account") {
        group_by = {
          include: [{ model: Account, attributes: ["id", "name"] }],
          group: ["Account.id"]
        };
      }
      if (input.group_by === "customer") {
        group_by = {
          include: [
            { model: Customer, attributes: ["id", "first_name", "last_name"] }
          ],
          group: ["Customer.id"]
        };
      }
      if (input.group_by === "account_type") {
        group_by = {
          include: [
            {
              model: Account,
              attributes: ["account_type_id"]
            }
          ],
          raw: true,
          group: ["Account.account_type_id"]
        };
      }

      const ledgers: Ledger = await Ledger.findAndCountAll({
        ...pagination,
        where: {
          fund_id: input.fund_id
        },
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("Ledger.value")), "value"]
        ],
        ...group_by
      });
      const meta = this.serviceHelper.meta(
        ledgers.count.length,
        input.page,
        pagination.limit
      );

      if (input.group_by === "account_type") {
        await Promise.all(
          ledgers.rows.map(async element => {
            const ledger = await AccountType.findByPk(
              element["Account.account_type_id"],
            );
            return (element["AccountType.name"] = ledger.name);
          })
        );
      }

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
        include: [
          Fund,
          Customer,
          {
            model: Account,
            include: [{ model: AccountType, as: "accountType" }]
          }
        ]
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
