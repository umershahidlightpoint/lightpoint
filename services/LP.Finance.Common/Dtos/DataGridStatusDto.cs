using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
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
        public string ExternalFilterState { get; set; }
        public string GridLayoutName { get; set; }
        public bool IsPublic { get; set; }
    }
}