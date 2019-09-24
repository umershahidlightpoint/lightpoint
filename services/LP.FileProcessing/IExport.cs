/*
* Start of a common library for generating and consuming files
*/
namespace LP.FileProcessing
{
    public interface IExport
    {
        object Process(string DateId);
    }

}
