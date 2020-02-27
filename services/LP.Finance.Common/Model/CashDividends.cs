using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class CashDividends
    {
        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedDate { get; set; }
        public string Symbol { get; set; }
        public DateTime? NoticeDate { get; set; }
        public DateTime? ExecutionDate { get; set; }
        public DateTime? RecordDate { get; set; }
        public DateTime? PayDate { get; set; }
        public decimal Rate { get; set; }
        public string Currency { get; set; }
        public decimal WithholdingRate { get; set; }
        public decimal FxRate { get; set; }
        public bool ActiveFlag { get; set; }

        private CashDividends(SqlDataReader reader)
        {
            var offset = 0;
            this.Id = reader.GetFieldValue<int>(offset++);
            this.CreatedBy = reader.GetFieldValue<string>(offset++);
            this.CreatedDate = reader.GetFieldValue<DateTime>(offset++);
            this.LastUpdatedBy = !reader.IsDBNull(offset) ? reader.GetFieldValue<string>(offset) : null;
            offset++;
            this.LastUpdatedDate = !reader.IsDBNull(offset) ? reader.GetFieldValue<DateTime?>(offset) : null;
            offset++;
            this.Symbol = reader.GetFieldValue<string>(offset++);
            this.NoticeDate = !reader.IsDBNull(offset) ? reader.GetFieldValue<DateTime?>(offset) : null;
            offset++;
            this.ExecutionDate = !reader.IsDBNull(offset) ? reader.GetFieldValue<DateTime?>(offset) : null;
            offset++;
            this.RecordDate = !reader.IsDBNull(offset) ? reader.GetFieldValue<DateTime?>(offset) : null;
            offset++;
            this.PayDate = !reader.IsDBNull(offset) ?  reader.GetFieldValue<DateTime?>(offset) : null;
            offset++;
            this.Rate = reader.GetFieldValue<decimal>(offset++);
            this.Currency = reader.GetFieldValue<string>(offset++);
            this.WithholdingRate = reader.GetFieldValue<decimal>(offset++);
            this.FxRate = reader.GetFieldValue<decimal>(offset++);
            this.ActiveFlag = reader.GetFieldValue<bool>(offset++);
        }

        public static List<CashDividends> Load(SqlConnection connection)
        {
            var list = new List<CashDividends>();

            var query = new SqlCommand("select * from cash_dividends with(nolock) where active_flag = 1", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                try
                {
                    list.Add(new CashDividends(reader));
                }
                catch (Exception ex)
                {

                }
            }
            reader.Close();
            return list;
        }
    }
}
