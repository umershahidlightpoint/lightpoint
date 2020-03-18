namespace LP.Shared
{
    public class ColumnDef
    {
        public string field { get; set; }
        public string headerName { get; set; }
        public bool filter { get; set; }
        public string Type { get; set; }
        public int? rowGroupIndex { get; set; }
        public string colId { get; set; }
        public bool hide { get; set; }
        public string aggFunc { get; set; }
    }
}