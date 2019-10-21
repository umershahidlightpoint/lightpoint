using GraphQL.Types;
using LP.Finance.Common.GraphQLTypes;
using LP.Finance.WebProxy.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.GraphQLEntities
{
    public class PerformanceQuery: ObjectGraphType
    {
        public PerformanceQuery()
        {
            Field<PerformanceType>("performance",
                  arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "fund" }),
                  resolve: context => new PerformanceService().GetMonthlyPerformance());
        }
    }
}
