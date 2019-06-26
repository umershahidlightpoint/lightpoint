using Microsoft.AspNet.SignalR;
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace LP.ReferenceData.WebProxy.Hubs
{
    /// <summary>
    /// Instance of this is created for each client connection, this means that we need to keep track of the connections
    /// here for forced feedback, i.e. realtime data
    /// </summary>
    public class MyHub : Hub
    {
        public void Send(string name, string message)
        {
            Clients.All.addMessage(name, message);
        }
    }
}