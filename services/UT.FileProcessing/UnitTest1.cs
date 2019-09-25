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

        [Test]
        public void S3Drop()
        {
            var s3 = new S3Endpoint();

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var filename = "import.txt";

            var folder = currentDir + "TestFiles" + System.IO.Path.DirectorySeparatorChar + $"{filename}";

            s3.Upload(folder);

        }

        [Test]
        public void TestImport()
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var filename = "import.txt";

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
    }
}