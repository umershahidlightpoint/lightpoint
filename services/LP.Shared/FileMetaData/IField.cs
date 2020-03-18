namespace LP.Shared.FileMetaData
{
    public interface IField
    {
        string Name { get; set; }
        object Value { get; set; }
        string Message { get; set; }
        FileProperties MetaData { get; set; }
    }
}
