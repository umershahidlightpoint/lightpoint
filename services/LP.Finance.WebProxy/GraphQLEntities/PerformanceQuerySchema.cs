using GraphQL.Types;

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
    