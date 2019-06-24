using System;
using System.Collections.Generic;
using System.Text;

namespace Sample.Shared
{
   public  class Account
    {
        // {"id":20,"name":"AT-Account1","accountType":{"id":4,"name":"Asset"}},
        public long id { get; set; }
        public string name { get; set; }

     //   public AccountType accountType { get; set; }
    }
    public class AccountType
    {
        public long id { get; set; }
        public string name { get; set; }

    }
}
