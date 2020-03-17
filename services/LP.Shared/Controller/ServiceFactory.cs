namespace LP.Core
{
    public class ServiceFactory
    {
        public static I GetProxyService<I, S>(bool isMock = false)
            where S : I, new()
        {
            if (!isMock)
            {
                return new S();
            }

            return default(S);
        }

    }

}
