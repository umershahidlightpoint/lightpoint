namespace LP.Shared.Model
{
    public class GridColDef
    {
        public string colId { get; set; }
        public bool hide { get; set; }
        string aggFunc { get; set; }
        int width { get; set; }
        int? rowGroupIndex { get; set; }
    }
}