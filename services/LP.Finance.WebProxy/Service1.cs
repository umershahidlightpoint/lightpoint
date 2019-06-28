using Microsoft.Owin.Hosting;
using System;
using System.ServiceProcess;

namespace LP.ReferenceData.WebProxy
{
    public partial class Service1 : ServiceBase
    {
        private string uri = "http://*:9092/";

        private IDisposable webapiEndPoint;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            webapiEndPoint = WebApp.Start<Startup>(uri);
        }

        public void Start()
        {
            webapiEndPoint = WebApp.Start<Startup>(uri);
        }

        protected override void OnStop()
        {
            if ( webapiEndPoint != null)
                webapiEndPoint.Dispose();
            webapiEndPoint = null;
        }
    }
}
