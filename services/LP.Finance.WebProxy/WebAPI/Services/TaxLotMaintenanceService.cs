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
                UpdateTaxLotStatus(obj, sqlHelper);
                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();

                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void UpdateTaxLotStatus(TaxLotReversalDto obj, SqlHelper sqlHelper)
        {
            List<List<SqlParameter>> listOfTaxLotStatusParameters = new List<List<SqlParameter>>();
            foreach (var item in obj.OpenLots)
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

        public object AlleviateTaxLot()
        {
            throw new NotImplementedException();
        }
    }
}
