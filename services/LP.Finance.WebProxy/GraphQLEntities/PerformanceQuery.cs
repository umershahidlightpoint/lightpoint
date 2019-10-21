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
                  arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "fund" }),
                  resolve: context => PerformanceResolver.GetMonthlyPerformance());
        }
    }
}
