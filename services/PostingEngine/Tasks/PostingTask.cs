using System.Text;
using System.Threading.Tasks;
using PostingEngine.Tasks.Implementation;

namespace PostingEngine.Tasks
{
    public interface IPostingTask
    {
        bool Run(PostingEngineEnvironment env);
    }

    public class PostingTasks
    {
        public static IPostingTask Get(string name)
        {
            if (name.Equals("costbasis"))
                return new CostBasisTask();
            if (name.Equals("pullfrombookmon"))
                return new PullFromBookmonTask();
            if (name.Equals("expencesandrevenues"))
                return new ExpencesAndRevenuesTask();
            if (name.Equals("dailypnl"))
                return new DailyPnlTask();
            if (name.Equals("endofyear"))
                return new EndOfYearTask();
            if (name.Equals("settledcashbalances"))
                return new SettledCashTask();
            if (name.Equals("cleanup"))
                return new CleanupTask();
            if (name.Equals("PeriodPnl"))
            {
                var task = new RunStoredProcTask()
                {
                    StoredProc = "PeriodPnl",
                    Module = "PeriodPnl"
                };

                return task;

            }

            return null;
        }

        public static async Task<bool> RunTask(PostingEngineEnvironment env,  IPostingTask task)
        {
            var result = Task.Run(() => task.Run(env));

            return await result;
        }
    }
}
