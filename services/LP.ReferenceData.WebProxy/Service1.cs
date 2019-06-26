using LP.ReferenceData.WebProxy.WebAPI;
using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace LP.ReferenceData.WebProxy
{
    public partial class Service1 : ServiceBase
    {
        private IDisposable webapiEndPoint;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            // Lets fire up the connection to the BoonMon service
            webapiEndPoint = WebApp.Start<Startup>("http://*:9091/");

        }

        public void Start()
        {
            // Lets fire up the connection to the BoonMon service
            webapiEndPoint = WebApp.Start<Startup>("http://*:9091/");
        }

        protected override void OnStop()
        {
            if ( webapiEndPoint != null)
                webapiEndPoint.Dispose();
            webapiEndPoint = null;
        }
    }
}
