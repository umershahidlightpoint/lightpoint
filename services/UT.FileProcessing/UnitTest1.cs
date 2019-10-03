using LP.FileProcessing;
using LP.FileProcessing.S3;
using NUnit.Framework;
using System;

namespace Tests
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

//        [Test]
//        public void S3Drop()
//        {
//            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
//            var filename = "Import.txt";
//            var file = currentDir + "TestFiles" + System.IO.Path.DirectorySeparatorChar + $"{filename}";
//
//            Assert.IsTrue(S3Endpoint.Upload(file));
//
//            Assert.Pass();
//        }

        [Test]
        public void TestImport()
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var filename = "Import.txt";

            var folder = currentDir + "TestFiles" + System.IO.Path.DirectorySeparatorChar + $"{filename}";

            var import = new SilverImportFile();
            var importedData = import.Import(folder);

            Assert.IsTrue(importedData.Header.Length > 0);
            Assert.IsTrue(importedData.Header[0] == "HDR");
            Assert.IsTrue(Convert.ToInt32(importedData.Header[5]) == importedData.Contents.Count);

            Assert.IsTrue(importedData.Footer.Length > 0);
            Assert.IsTrue(importedData.Footer[0] == "TRL");
            Assert.IsTrue(Convert.ToInt32(importedData.Footer[5]) == importedData.Contents.Count);

            Assert.IsTrue(importedData.Contents.Count > 0);

            Assert.Pass();
        }

        [Test]
        public void CheckValidDecimalFormat()
        {
            var number = 123456789.123456m;

            new FileProcessor().CheckFormat(number, "18,6", "decimal", out var valid);

            Assert.IsTrue(valid);
        }


        [Test]
        public void CheckInValidDecimalFormat()
        {
            var number = 123456789.1234567m;

            new FileProcessor().CheckFormat(number, "18,6", "decimal", out var valid);

            Assert.IsFalse(valid);
        }

        [Test]
        public void CheckEdgeCaseDecimalFormat()
        {
            var number = 123456789101.123456m;

            new FileProcessor().CheckFormat(number, "18,6", "decimal", out var valid);

            Assert.IsTrue(valid);
        }

        [Test]
        public void CheckValidCharFormat()
        {
            var character = "Usman";

            new FileProcessor().CheckFormat(character, "10", "char", out var valid);

            Assert.IsTrue(valid);
        }

        [Test]
        public void CheckInValidCharFormat()
        {
            var character = "Usman";

            new FileProcessor().CheckFormat(character, "4", "char", out var valid);

            Assert.IsFalse(valid);
        public void ValidFormatDates()
        {
            FileProcessor fileProcessor = new FileProcessor();

            Assert.IsTrue(checkFormat("yyyy-MM-dd", "yyyy-MM-dd"));

            Assert.Pass();
        }

        [Test]
        public void InvalidFormatDates()
        {
            FileProcessor fileProcessor = new FileProcessor();

            Assert.IsFalse(checkFormat("yyyy-MM-dd", "MM-yyyy-dd"));

            Assert.Pass();
        }

        [Test]
        public void validTypeLong()
        {
            FileProcessor fileProcessor = new FileProcessor();
            var result = (bool?)new FileProcessor().LongShortConversion("long");
            bool isValid = result == true ? true : false;
            Assert.IsTrue(isValid);
            Assert.Pass();
        }

        [Test]
        public void validTypeShort()
        {
            FileProcessor fileProcessor = new FileProcessor();
            var result = (bool?)new FileProcessor().LongShortConversion("short");
            bool isValid = result == false ? true : false;
            Assert.IsTrue(isValid);
            Assert.Pass();
        }

        [Test]
        public void InvalidLongShortConversion()
        {
            FileProcessor fileProcessor = new FileProcessor();
            var result = (bool?)new FileProcessor().LongShortConversion("57657");
            bool isValid = result == null ? true : false;
            Assert.IsTrue(isValid);
            Assert.Pass();
        }

        public bool checkFormat(string inputFormat, string comparisonFormat)
        {
            var result = new FileProcessor().GetDate(DateTime.Now, inputFormat, "", out var valid);
            if (DateTime.TryParseExact(result.ToString(), comparisonFormat, null, System.Globalization.DateTimeStyles.None, out var Test))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}