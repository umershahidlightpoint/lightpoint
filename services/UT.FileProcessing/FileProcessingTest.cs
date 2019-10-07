using System;
using System.IO;
using Amazon;
using Amazon.S3;
using LP.FileProcessing;
using LP.FileProcessing.S3;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;

namespace UT.FileProcessing
{
    [TestFixture]
    public class Tests
    {
        private AmazonS3Client S3Client;
        private S3Endpoint s3Endpoint;

        [OneTimeSetUp]
        public void Setup()
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            var accessKeyId = config["AWS:AccessKeyId"];
            var secretAccessKey = config["AWS:SecretAccessKey"];

            S3Client = new AmazonS3Client(accessKeyId, secretAccessKey, RegionEndpoint.USEast2);
            s3Endpoint = new S3Endpoint(S3Client);
        }

        [Test]
        public void S3Upload()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var filename = "Import.txt";
            var file = currentDir + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";

            Assert.IsTrue(s3Endpoint.UploadFileToS3(file));

            Assert.Pass();
        }

        [Test]
        public void S3Download()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var file = currentDir + "TestFiles" + Path.DirectorySeparatorChar + "TestFile.txt";

            Assert.IsTrue(s3Endpoint.DownloadFileFromS3(file));

            Assert.Pass();
        }

        [Test]
        public void S3FilesList()
        {
            Assert.IsTrue(s3Endpoint.ListS3Files().Count > 0);

            Assert.Pass();
        }

        [Test]
        public void TestImport()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var filename = "Import.txt";
            var folder = currentDir + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";

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
            var character = "Random";

            new FileProcessor().CheckFormat(character, "10", "char", out var valid);

            Assert.IsTrue(valid);
        }

        [Test]
        public void CheckInValidCharFormat()
        {
            var character = "Random";

            new FileProcessor().CheckFormat(character, "4", "char", out var valid);

            Assert.IsFalse(valid);
        }

        [Test]
        public void ValidFormatDates()
        {
            Assert.IsTrue(CheckFormat("yyyy-MM-dd", "yyyy-MM-dd"));

            Assert.Pass();
        }

        [Test]
        public void InvalidFormatDates()
        {
            Assert.IsFalse(CheckFormat("yyyy-MM-dd", "MM-yyyy-dd"));

            Assert.Pass();
        }

        [Test]
        public void ValidTypeLong()
        {
            new FileProcessor().LongShortConversion("long", out var valid);

            Assert.IsTrue(valid);

            Assert.Pass();
        }

        [Test]
        public void ValidTypeShort()
        {
            new FileProcessor().LongShortConversion("short", out var valid);

            Assert.IsTrue(valid);

            Assert.Pass();
        }

        [Test]
        public void InvalidLongShortConversion()
        {
            new FileProcessor().LongShortConversion("57657", out var valid);

            Assert.IsFalse(valid);

            Assert.Pass();
        }

        public bool CheckFormat(string inputFormat, string comparisonFormat)
        {
            var result = new FileProcessor().GetDate(DateTime.Now, inputFormat, "", out var valid);
            if (DateTime.TryParseExact(result.ToString(), comparisonFormat, null,
                System.Globalization.DateTimeStyles.None, out var Test))
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