using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
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
                int prospectiveTradeQuantity = Math.Abs(obj.ProspectiveTrade.Quantity);
                if (lotSum < prospectiveTradeQuantity)
                {
                    message = "Quantity Mismatch";
                }

                List<TaxLot> taxLotList = new List<TaxLot>();
                TaxLot t = new TaxLot();
                foreach (var item in obj.OpenTaxLots)
                {
                    if(Math.Abs(item.RemainingQuantity) <= prospectiveTradeQuantity)
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
                    t.CostBasis = 0;
                    t.InvestmentAtCost = 0;
                    t.TradeDate = DateTime.UtcNow;
                    t.TradePrice = 0;
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
    }
}
