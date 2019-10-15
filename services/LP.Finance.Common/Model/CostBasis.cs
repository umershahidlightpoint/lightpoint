﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Models
{
    public class CostBasisDto : IDbAction, IDbModel
    {
        public DateTime BusinessDate { get; set; }
        public double CostBasis { get; set; }
        public string Symbol { get; set; }
        public int SecurityId { get; set; }

        // Get a list of Journal Entries for this trade
        public static KeyValuePair<string, SqlParameter[]> List(string orderId)
        {
            var sql = @"select * from cost_basis where source=@source";

            var sqlParams = new SqlParameter[]
            {
                    new SqlParameter("source", orderId),
            };

            return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
        }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = @"insert into cost_basis
                            (business_date, security_id, 
                            symbol, cost_basis) 
                            values 
                            (@business_date, @security_id, @symbol, @cost_basis)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("business_date", BusinessDate),
                    new SqlParameter("security_id", SecurityId),
                    new SqlParameter("symbol", Symbol),
                    new SqlParameter("cost_basis", CostBasis),


                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update
        {
            get
            {
                var sql = "update journal set a=b, c=d where id = @id";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter()
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();


        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString + ";Password=ggtuser");
            localconnection.Open();
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 business_date, security_id, symbol, cost_basis FROM cost_basis", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;

        }
        public void PopulateRow(DataRow row)
        {
            row["business_date"] = this.BusinessDate;
            row["security_id"] = this.SecurityId;
            row["symbol"] = this.Symbol;
            row["cost_basis"] = this.CostBasis;
        }

        /// <summary>
        /// Generates the CostBasis, based on the data available in the journal entries, so these all
        /// need to be generate before we calculate the Cost Basis
        /// </summary>
        /// <param name="connection">DB Connection</param>
        /// <param name="businessDate">The buisness date</param>
        public static void Calculate(SqlConnection connection, SqlTransaction trans, DateTime businessDate)
        {
            var busDate = businessDate.Date.ToString("MM-dd-yyyy");

            var sqlLong = $@"insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side )
SELECT '{busDate}', journal.symbol, Abs(sum(value)) as Balance, sum(quantity) as Quantity, Abs(sum(value)) / sum(quantity) as CostBasis, 'LONG'
  FROM journal with(nolock)
inner join account a on a.id = journal.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'LONG POSITIONS AT COST'
and journal.[when] <= '{busDate}'
group by a.name, journal.symbol
having sum(quantity) != 0";

            var sqlShort = $@"insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side )
SELECT '{busDate}', journal.symbol, Abs(sum(value)) as Balance, sum(quantity) as Quantity, Abs(sum(value)) / sum(quantity) as CostBasis, 'SHORT'
  FROM journal with(nolock)
inner join account a on a.id = journal.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'SHORT POSITIONS-COST'
and journal.[when] <= '{busDate}'
group by a.name, journal.symbol
having sum(quantity) != 0";

            using (var command = new SqlCommand(sqlLong, connection, trans))
            {
                command.CommandType = CommandType.Text;
                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Delete with Transaction Exception: {ex}");
                    throw;
                }
            }

            using (var command = new SqlCommand(sqlShort, connection, trans))
            {
                command.CommandType = CommandType.Text;
                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Delete with Transaction Exception: {ex}");
                    throw;
                }
            }

        }
    }

}
