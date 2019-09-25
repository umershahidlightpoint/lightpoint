/*
* Start of a common library for generating and consuming files
*/
using System.Collections.Generic;
using System.Linq;

namespace LP.FileProcessing
{
    public interface IImport
    {
        object Process(string DateId);
    }

    public class File
    {
        /// <summary>
        /// Header
        /// </summary>
        public string[] Header { get; set; }

        /// <summary>
        /// Footer
        /// </summary>
        public string[] Footer { get; set; }

        /// <summary>
        /// Contents of the file, returns a list of string arrays
        /// </summary>
        public List<string[]> Contents { get; set; }
    }

    public class SilverImportFile
    {
        public File Import(string filename)
        {
            var file = new File();

            var lines = System.IO.File.ReadAllLines(filename);
            var listLines = lines.ToList<string>();

            file.Header = listLines.First().Split('|');
            file.Footer = listLines.Last().Split('|');

            listLines.RemoveAt(listLines.Count - 1);
            listLines.RemoveAt(0);

            file.Contents = listLines.Select(i=>i.Split('|')).ToList();

            return file;
        }
    }

    public class HeaderFooter
    {
        public HeaderFooter() {
            //var mapping = new[] {
            //    new { "RECORD_TYPE", "Char(3)", "[HDR, TRL]"},
            //    new { "FILE_TYPE", "Char(3)", "[TXD, OPR, CLD, CLR]"},
            //    new { "BUSINESS_DATE", "DATE(CCYY-MM-DD)", ""},
            //    new { "RUN_DATETIME", "DATETIME(CCYY-MM-DD’T’HH:MM:SS)", ""},
            //    new { "PRIOR_RUN_DATETIME", "DATETIME(CCYY-MM-DD’T’HH:MM:SS)", ""},
            //    new { "RECORD_COUNT", "UNSIGNED INT(10)", ""},
            //};
        }
    }
}