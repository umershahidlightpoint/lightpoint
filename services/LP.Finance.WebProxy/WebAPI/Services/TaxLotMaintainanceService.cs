using LP.Finance.Common;
using LP.Finance.Common.Dtos;
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
    public class TaxLotMaintainanceService : ITaxLotMaintainanceService
    {
        private static readonly string
           connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);

        public object ReverseTaxLotAlleviation(TaxLotReversalDto obj)
        {
            try
            {
                var openLot = obj.openLots.ElementAtOrDefault(0);
                string newTaxLotStatus;
                int newRemainingQuantity;
                int totalSumOfClosingQuantity = obj.closingLots.Sum(x => Math.Abs(x.Quantity));
                int remainingAfterReversal = totalSumOfClosingQuantity + Math.Abs(openLot.RemainingQuantity);
                if (Math.Abs(openLot.OriginalQuantity) == remainingAfterReversal)
                {
                    newTaxLotStatus = "Open";
                }
                else
                {
                    newTaxLotStatus = "Partially Closed";
                }

                if (openLot.Side == "SHORT")
                {
                    newRemainingQuantity = remainingAfterReversal * -1;
                }
                else
                {
                    newRemainingQuantity = remainingAfterReversal;
                }


                List<SqlParameter> listOfOpenLotParameters = new List<SqlParameter>()
                {
                    new SqlParameter("open_id", openLot.OpenLotId),
                    new SqlParameter("status", newTaxLotStatus),
                    new SqlParameter("quantity", newRemainingQuantity)
                };

                SqlHelper sqlHelper = new SqlHelper(connectionString);
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var openLotQuery = $@"UPDATE [dbo].[tax_lot_status]
                                                SET [status] = @status,
                                                [quantity] = @quantity,
                                                where [open_id] = @open_id";

                sqlHelper.Update(openLotQuery, CommandType.Text, listOfOpenLotParameters.ToArray());

                List<List<SqlParameter>> listOfClosingLotParameters = new List<List<SqlParameter>>();
                foreach (var item in obj.closingLots)
                {
                    List<SqlParameter> closingLotParams = new List<SqlParameter>
                    {
                        new SqlParameter("closing_lot_id", item.ClosingLotId)

                    };

                    listOfClosingLotParameters.Add(closingLotParams);
                }

                var taxLotQuery = $@"UPDATE [dbo].[tax_lot]
                                                SET [active_flag] = 0,
                                                where [closing_lot_id] = @closing_lot_id";

                foreach (var item in listOfClosingLotParameters)
                {
                    sqlHelper.Update(taxLotQuery, CommandType.Text, item.ToArray());

                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object AlleviateTaxLot()
        {
            throw new NotImplementedException();
        }
    }
}
