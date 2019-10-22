using GraphQL.Types;
using LP.Finance.Common;
using LP.Finance.WebProxy.WebAPI.Resolvers;

namespace LP.Finance.WebProxy.GraphQLEntities
{
    public class PerformanceQuery: ObjectGraphType
    {
        public PerformanceQuery()
        {
            Field<ListGraphType<PerformanceType>>("performance",
                  arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "fund" }),
                  resolve: context =>
                  {
                      var fund = context.GetArgument<string>("fund");
                      return PerformanceResolver.GetMonthlyPerformance(fund);
                  });
        }
    }
}
