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
                arguments: new QueryArguments(new QueryArgument<StringGraphType> {Name = "date"},
                    new QueryArgument<StringGraphType> {Name = "fund"},
                    new QueryArgument<StringGraphType> {Name = "portfolio"}),
                resolve: context =>
                {
                    var date = context.GetArgument<string>("date");
                    var fund = context.GetArgument<string>("fund");
                    var portfolio = context.GetArgument<string>("portfolio");
                    return PerformanceResolver.GetMonthlyPerformance(date, fund, portfolio);
                });
        }
    }
}