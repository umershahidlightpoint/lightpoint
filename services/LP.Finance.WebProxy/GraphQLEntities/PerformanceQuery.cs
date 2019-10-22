using GraphQL.Types;
using LP.Finance.Common.GraphQLTypes;
using LP.Finance.WebProxy.WebAPI.Resolvers;

namespace LP.Finance.WebProxy.GraphQLEntities
{
    public class PerformanceQuery : ObjectGraphType
    {
        public PerformanceQuery()
        {
            Field<ListGraphType<PerformanceType>>("performance",
                arguments: new QueryArguments(new QueryArgument<StringGraphType> {Name = "dateFrom"},
                    new QueryArgument<StringGraphType> { Name = "dateTo" },
                    new QueryArgument<StringGraphType> {Name = "fund"},
                    new QueryArgument<StringGraphType> {Name = "portfolio"}),
                resolve: context =>
                {
                    var dateFrom = context.GetArgument<string>("dateFrom");
                    var dateTo = context.GetArgument<string>("dateTo");
                    var fund = context.GetArgument<string>("fund");
                    var portfolio = context.GetArgument<string>("portfolio");
                    return PerformanceResolver.GetMonthlyPerformance(dateFrom, dateTo, fund, portfolio);
                });
        }
    }
}