using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine
{
    public class FxRate
    {
        public string CurrencyCode { get; set; }
        public decimal Rate { get; set; }
    }

    public class TaxRate
    {
        public decimal ShortTerm { get; set; }
        public decimal LongTerm { get; set; }

        public int ShortTermPeriod { get; set; }
    }

    public class TradeTaxRate
    {
        public decimal Rate { get; set; }

        public int DaysToLongTerm { get; set; }

        public bool IsShortTerm { get; set; }
    }

    public class MarketPrice
    {
        public string Symbol { get; set; }
        public double Price { get; set; }
    }

    /*
     */
    public class FxRates
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PriceMasterDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, FxRate> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, FxRate>>("fxrates");
            }

            var maxdate = now.ToString("MM-dd-yyyy 23:59:59");

            var sql = $@"select c.CurrencyCode, fx.FxRate, fx.*, p.SourceName from [PriceMaster].[dbo].[FXRate] fx
inner join [SecurityMaster].[dbo].[Currency] c on c.CurrencyId = fx.CurrencyId
inner join [PriceMaster].[dbo].[PriceSource] p on p.PriceSourceID = fx.PriceSourceID
-- where c.CurrencyCode = 'JPY'
where Runtime = ( select max(Runtime) from [PriceMaster].[dbo].[FXRate] where runtime <= '{maxdate}') -- Specify the date and grab the latest
order by c.CurrencyCode desc
";

            var list = new Dictionary<string, FxRate>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var currencyCode = reader.GetFieldValue<string>(0);
                    var rate = reader.GetFieldValue<decimal>(1);

                    list.Add(currencyCode, new FxRate
                    {
                        CurrencyCode = currencyCode,
                        Rate = rate,
                    });
                }
                reader.Close();
                con.Close();
            }

            Utils.Save(list, "fxrates");

            return list;
        }
    }

    public class TaxRates
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private readonly bool Mock = false;

        public TaxRate Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<TaxRate>("taxrates");
            }

            var businessdate = now.Date;

            var sql = $@"TaxRates";

            var list = new List<TaxRate>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                query.CommandType = CommandType.StoredProcedure;
                query.Parameters.Add("@businessDate", SqlDbType.VarChar).Value = businessdate;

                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    list.Add(new TaxRate
                    {
                        ShortTerm = reader.GetFieldValue<decimal>(0),
                        LongTerm = reader.GetFieldValue<decimal>(1),
                        ShortTermPeriod = reader.GetFieldValue<int>(2)
                    });
                }
                reader.Close();
                con.Close();
            }

            var taxrate = list.FirstOrDefault();

            Utils.Save(taxrate, "taxrates");

            return taxrate;
        }
    }

    public class MarketPrices
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, MarketPrice> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, MarketPrice>>("marketprices");
            }

            var busdate = now.ToString("MM-dd-yyyy");

            var sql = $@"SELECT 
	Securitycode as Symbol ,Price
    FROM [PositionMaster].[dbo].[IntraDayPositionSplit]
	where BusDate = '{busdate}' and LastModifiedOn = (select max(LastModifiedOn) from [PositionMaster].[dbo].[IntraDayPositionSplit] where BusDate = '{busdate}')
	and Price != 0.0
	order by Symbol asc

";

            var list = new Dictionary<string, MarketPrice>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var symbol = reader.GetFieldValue<string>(0);
                    var rate = reader.GetFieldValue<decimal>(1);

                    list.Add(symbol, new MarketPrice
                    {
                        Symbol = symbol,
                        Price = Convert.ToDouble(rate),
                    });
                }
                reader.Close();
                con.Close();
            }

            Utils.Save(list, "marketprices");

            return list;
        }
    }

    public class CostBasises
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, CostBasisDto> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, CostBasisDto>>("costbasis");
            }

            var busdate = now.ToString("MM-dd-yyyy");

            var sql = $@"SELECT 
	Symbol , cost_basis
    FROM [cost_basis]
	where business_date = '{busdate}'";

            var list = new Dictionary<string, CostBasisDto>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var symbol = reader.GetFieldValue<string>(0);
                    var rate = reader.GetFieldValue<decimal>(1);

                    list.Add(symbol, new CostBasisDto
                    {
                        Symbol = symbol,
                        CostBasis = Convert.ToDouble(rate),
                    });
                }
                reader.Close();
                con.Close();
            }

            //Utils.Save(list, "costbasis");

            return list;
        }
    }

}
