using GraphQL.Types;
using LP.Finance.Common.Model;

namespace LP.Finance.Common.GraphQLTypes
{
    public class PerformanceType : ObjectGraphType<MonthlyPerformance>
    {
        public PerformanceType()
        {
            Field(x => x.Id).Description("Performance Identifier");
            Field(x => x.Fund).Description("Performance recorded against a particular Fund");
            Field(x => x.PortFolio).Description("Performance recorded against a particular Portfolio");
            Field(x => x.PerformanceDate).Description("Performance recorded against a particular Date");
            Field(x => x.MTD.Value).Description("Month to Date %");
            Field(x => x.YTD).Description("Year to Date %");
            Field(x => x.QTD).Description("Quarter to Date %");
            Field(x => x.ITD).Description("Inception to Date %");
        }
    }
}