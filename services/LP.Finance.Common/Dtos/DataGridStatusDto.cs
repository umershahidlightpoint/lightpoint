using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace LP.Finance.Common.Dtos
{
    enum GridName
    {
        Journal = 1 
    }

    public class DataGridStatusDto
    {
        public int Id { get; set; }
        [Required] public int UserId { get; set; }
        [Required] public int GridId { get; set; }
        public string GridName { get; set; }
        public string PivotMode { get; set; }
        public string ColumnState { get; set; }
        public string GroupState { get; set; }
        public string SortState { get; set; }
        public string FilterState { get; set; }

        public string GridLayoutName { get; set; }
    }
}
