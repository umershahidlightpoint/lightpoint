﻿using LP.Finance.Common.Models;
using System.Linq;

namespace PostingEngine.ClientSpecifics
{
    public class BaseSpecifics : IClientSpecifics
    {
        public Transaction[] Transform(Transaction[] trades)
        {
            var update = trades.Where(t => t.SecurityType.Equals("REIT")).ToArray();
            foreach (var t in update) { t.SecurityType = "Common Stock"; }

            return trades;
        }
    }
}
