using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class TaxLotMaintenanceService : ITaxLotMaintenanceService
    {
        private static readonly string
           connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);

        public object ReverseTaxLotAlleviation(TaxLotReversalDto obj)
        {
            try
            {
                foreach (var item in obj.ClosingLots)
                {
                    var taxLotStatus = obj.OpenLots.Where(x => x.OpenLotId == item.OpenLotId).FirstOrDefault();
                    int remainingAfterReversal = Math.Abs(item.Quantity) + Math.Abs(taxLotStatus.RemainingQuantity);
                    if (taxLotStatus.Side == "SHORT")
                    {
                        taxLotStatus.RemainingQuantity = remainingAfterReversal * -1;
                    }
                    else
                    {
                        taxLotStatus.RemainingQuantity = remainingAfterReversal;
                    }

                    if (taxLotStatus.OriginalQuantity == taxLotStatus.RemainingQuantity)
                    {
                        taxLotStatus.Status = "Open";
                    }
                    else
                    {
                        taxLotStatus.Status = "Partially Closed";
                    }

                }

                SqlHelper sqlHelper = new SqlHelper(connectionString);
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();
                UpdateTaxLot(obj, sqlHelper);
                UpdateTaxLotStatus(obj.OpenLots, sqlHelper);
                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();

                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void UpdateTaxLotStatus(List<OpenTaxLot> obj, SqlHelper sqlHelper)
        {
            List<List<SqlParameter>> listOfTaxLotStatusParameters = new List<List<SqlParameter>>();
            foreach (var item in obj)
            {
                List<SqlParameter> taxLotStatusParams = new List<SqlParameter>
                    {
                        new SqlParameter("id", item.Id),
                        new SqlParameter("status", item.Status),
                        new SqlParameter("quantity", item.RemainingQuantity)

                    };

                listOfTaxLotStatusParameters.Add(taxLotStatusParams);
            }

            var taxLotStatusQuery = $@"UPDATE [dbo].[tax_lot_status]
                                                SET [status] = @status,
                                                [quantity] = @quantity
                                                where [id] = @id";

            foreach (var item in listOfTaxLotStatusParameters)
            {
                sqlHelper.Update(taxLotStatusQuery, CommandType.Text, item.ToArray());

            }
        }

        private static void UpdateTaxLot(TaxLotReversalDto obj, SqlHelper sqlHelper)
        {
            var listOfClosingLotParameters = new List<List<SqlParameter>>();
            foreach (var item in obj.ClosingLots)
            {
                List<SqlParameter> closingLotParams = new List<SqlParameter>
                    {
                        new SqlParameter("id", item.Id)

                    };

                listOfClosingLotParameters.Add(closingLotParams);
            }

            var taxLotQuery = $@"UPDATE [dbo].[tax_lot]
                                                SET [active_flag] = 0
                                                where [id] = @id";
            foreach (var item in listOfClosingLotParameters)
            {
                sqlHelper.Update(taxLotQuery, CommandType.Text, item.ToArray());

            }
        }

        private static void InsertTaxLot(List<TaxLot> obj, SqlHelper sqlHelper)
        {
            new SQLBulkHelper().Insert("tax_lot",obj.ToArray(),
                        sqlHelper.GetConnection(), sqlHelper.GetTransaction());
        }

        public object AlleviateTaxLot(AlleviateTaxLotDto obj)
        {
            try
            {
                string symbol = obj.ProspectiveTrade.Symbol;
                string side = obj.ProspectiveTrade.Side;
                string message = "Tax Lot(s) Alleviated Successfully";
                if (side.Equals("COVER"))
                {
                    if (!obj.OpenTaxLots.All(x => x.Side.Equals("SHORT")))
                    {
                        message = "All selected lots are not SHORT";
                    }
                }
                else if (side.Equals("SELL"))
                {
                    if (!obj.OpenTaxLots.All(x => x.Side.Equals("BUY")))
                    {
                        message = "All selected lots are not BUY";
                    }
                }
                else
                {
                    message = "Incorrect side for this transaction";
                }

                int lotSum = obj.OpenTaxLots.Sum(x => Math.Abs(x.RemainingQuantity));
                int prospectiveTradeQuantity = Math.Abs(obj.ProspectiveTrade.RemainingQuantity);
                if (lotSum < prospectiveTradeQuantity)
                {
                    //message = "Quantity Mismatch";
                }

                List<TaxLot> taxLotList = new List<TaxLot>();
                foreach (var item in obj.OpenTaxLots)
                {
                    TaxLot t = new TaxLot();
                    if(prospectiveTradeQuantity == 0)
                    {
                        break;
                    }
                    else if (Math.Abs(item.RemainingQuantity) <= prospectiveTradeQuantity)
                    {
                        item.Status = "Closed";
                        if(Math.Abs(item.RemainingQuantity) < prospectiveTradeQuantity)
                        {
                            t.Quantity = Math.Abs(item.RemainingQuantity);
                        }
                        else
                        {
                           t.Quantity = prospectiveTradeQuantity;
                        }

                        prospectiveTradeQuantity -= Math.Abs(item.RemainingQuantity);
                        item.RemainingQuantity = 0;

                    }
                    else if (Math.Abs(item.RemainingQuantity) > prospectiveTradeQuantity)
                    {
                        item.Status = "Partially Closed";
                        int absRemainingQuantity = Math.Abs(item.RemainingQuantity) - prospectiveTradeQuantity;
                        t.Quantity = prospectiveTradeQuantity;
                        prospectiveTradeQuantity = 0;
                        if (item.RemainingQuantity < 0)
                        {
                            item.RemainingQuantity = absRemainingQuantity * -1;
                        }
                        else
                        {
                            item.RemainingQuantity = absRemainingQuantity;
                        }
                    }

                    t.OpeningLotId = item.OpenLotId;
                    t.ClosingLotId = obj.ProspectiveTrade.LpOrderId;

                    //TODO. temporary assignment for now
                    t.BusinessDate = DateTime.UtcNow;
                    t.RealizedPnl = (obj.ProspectiveTrade.TradePrice - item.TradePrice) * t.Quantity;
                    t.CostBasis = obj.ProspectiveTrade.TradePrice;
                    t.TradePrice = item.TradePrice;
                    t.TradeDate = DateTime.UtcNow;
                    t.Quantity = SignedValueBasedOnSide(t.Quantity, obj.ProspectiveTrade.Side);
                    t.InvestmentAtCost = t.Quantity * t.TradePrice * -1;
                    taxLotList.Add(t);
                }

                SqlHelper sqlHelper = new SqlHelper(connectionString);
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();
                InsertTaxLot(taxLotList, sqlHelper);
                UpdateTaxLotStatus(obj.OpenTaxLots, sqlHelper);
                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
                return Utils.Wrap(true, null, HttpStatusCode.OK, message);
            }
            catch(Exception ex)
            {
                throw ex;
            }

        }

        public object ProspectiveTradesForTaxLotAlleviation(string symbol, string side)
        {
            try
            {
                string correspondingSide = "";
                SqlHelper sqlHelper = new SqlHelper(connectionString);
                switch (side)
                {
                    case "BUY":
                        correspondingSide = "SELL";
                        break;
                    case "SHORT":
                        correspondingSide = "COVER";
                        break;
                    default:
                        break;
                }

                List<SqlParameter> sqlParams = new List<SqlParameter>()
            {
                new SqlParameter("side", correspondingSide),
                new SqlParameter("symbol", symbol)
            };

                var query = $@"select tr.LPOrderId, tr.Symbol, tr.Side, tr.Quantity, tr.TradePrice,
                            (case when tr.side = 'SELL' then coalesce((abs(tr.Quantity) - gt.lot_quantity) * -1,tr.Quantity)
                            else coalesce((abs(tr.Quantity) - gt.lot_quantity),tr.Quantity)
                            end)
                            as RemainingQuantity
                            from current_trade_state tr
                            left join (
                            select t.closing_lot_id, sum(abs(t.quantity)) as lot_quantity from tax_lot t
                            where t.active_flag = 1
                            group by t.closing_lot_id
                            ) gt on gt.closing_lot_id = tr.LPOrderId
                            where tr.symbol = @symbol and tr.side = @side and (abs(tr.Quantity) > gt.lot_quantity or lot_quantity is null)
                            order by tr.UpdatedOn desc";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
                var serialized = JsonConvert.SerializeObject(dataTable);
                var resp = JsonConvert.DeserializeObject(serialized);
                return Utils.Wrap(true, resp, HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        internal double SignedValueBasedOnSide(double value, string side)
        {
            switch (side)
            {
                case "SELL":
                    return value * -1;
                case "COVER":
                    return value;
                default:
                    return value;
            }

        }
    }
}
