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
        }
    }
}