using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace PostingEngine.MarketData
{
    public class SecurityDetails
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["SecurityMasterDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, SecurityDetail> Get()
        {
            if (Mock)
            {
                return LP.Shared.Utils.GetFile<Dictionary<string, SecurityDetail>>("securitydetails");
            }

            var sql = $@"select SecurityCode, BbergCode, EzeTicker, coalesce(sd.Multiplier, sf.ContractSize) as Multiplier from Security s
left join SecDerivatives sd on sd.SecurityId = s.SecurityId
left join SecFutures sf on sf.SecurityId = s.SecurityId
where coalesce(sd.Multiplier, sf.ContractSize) is not null";

            var list = new Dictionary<string, SecurityDetail>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var securityCode = reader.GetFieldValue<string>(0);
                    var bloombergCode = reader.GetFieldValue<string>(1);
                    var ezeTicker = reader.GetFieldValue<string>(2);
                    var multiplier = Convert.ToDouble(reader.GetFieldValue<decimal>(3));

                    list.Add(ezeTicker, new SecurityDetail
                    {
                        BloombergCode = bloombergCode,
                        SecurityCode = securityCode,
                        EzeTicker = ezeTicker,
                        Multiplier = multiplier,
                    });
                }
                reader.Close();
                con.Close();
            }

            LP.Shared.Utils.Save(list, "securitydetails");

            return list;
        }
    }
}
