using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class Tag : IDbAction
    {
        public static List<Tag> Tags {  get { return _tags; } }
        private static List<Tag> _tags = null;

        public static List<Tag> Load(SqlConnection connection)
        {
            var list = new List<Tag>();

            var query = new SqlCommand("select id, table_name, pk_name, column_name from tag", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                list.Add(new Tag
                {
                    Id = reader.GetFieldValue<Int32>(0),
                    TypeName = reader.GetFieldValue<string>(1),
                    PkName = reader.GetFieldValue<string>(2),
                    PropertyName = reader.GetFieldValue<string>(3),
                });
            }
            reader.Close();

            _tags = list;
            _tags.Add(new Tag { Id = -1, TypeName = "undefined", PkName = "undefined", PropertyName = "empty" });

            return _tags;
        }

        public int Id { get; set; }
        public string TypeName { get; set; }
        public string PkName { get; set; }
        public string PropertyName { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into tag (table_name, pk_name, column_name) values (@table_name, @pk_name, @column_name)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("table_name", TypeName),
                    new SqlParameter("pk_name", PkName),
                    new SqlParameter("column_name", PropertyName)
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }
}
