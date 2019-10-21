using GraphQL;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Dependencies;

namespace LP.Finance.WebProxy.GraphQLEntities
{
    public class PerformanceQuerySchema : Schema
    {
        public PerformanceQuerySchema(GraphQL.IDependencyResolver resolve)
        {
            Query = resolve.Resolve<PerformanceQuery>();
        }
    }
}
    