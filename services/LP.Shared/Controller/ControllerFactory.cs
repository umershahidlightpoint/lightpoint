namespace LP.Shared.Controller
{
    /// <summary>
    /// Used by the controllers to make it simple to switch between Mock and Service
    /// </summary>
    public class ControllerFactory
    {
        public static I Get<I, M, S>(bool isMock = false)
            where M : I, new()
            where S : I, new()
        {
            if (!isMock)
            {
                return new S();
            }

            return new M();
        }
    }
}