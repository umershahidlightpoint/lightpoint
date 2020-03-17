using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class SymbolChangeInputDto
    {
        public int Id { get; set; }
        public string OldSymbol { get; set; }
        public string NewSymbol { get; set; }
        public DateTime ExecutionDate { get; set; }
        public DateTime NoticeDate { get; set; }
    }
}