using GraphQL.Types;
using LP.Finance.Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
    public class PerformanceType: ObjectGraphType<MonthlyPerformance>
    {
        public PerformanceType()
        {
            Field(x => x.Id).Description("Performance Identifier");
            Field(x => x.YTD).Description("Year to date %");
            Field(x => x.MTD.Value).Description("Month to date %");
            Field(x => x.QTD).Description("Quarter to date %");
            Field(x => x.Fund).Description("Performance recorded against a particular fund");
            Field(x => x.PortFolio).Description("Performance recorded against a particular portfolio");
            Field(x => x.PerformanceDate).Description("Performance recorded against a particular date");
        }

    }
}
