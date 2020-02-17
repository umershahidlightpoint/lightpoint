using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class ConfigurationInputDto
    {
        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public string Project { get; set; }
        public string UOM { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        
    }
}
