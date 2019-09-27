﻿using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using System;
using System.IO;
using System.Threading.Tasks;
using Amazon.Runtime;

namespace LP.FileProcessing.S3
{
    public class S3Endpoint
    {
        // Credentials
        private const string bucketName = "lattimore.drop";
        private const string keyName = "uploaded-data";
        private const string accessKeyId = "";
        private const string secretAccessKey = "";

        // Specify your Bucket Region
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast2;

        public static bool Upload(string filePath)
        {
            return UploadFileAsync(filePath, bucketRegion).GetAwaiter().GetResult();
        }

        public static bool Download(string filePath)
        {
            return DownloadFileAsync(filePath, bucketRegion).GetAwaiter().GetResult();
        }

        private static async Task<bool> UploadFileAsync(string filename, RegionEndpoint endpoint)
        {
            AmazonS3Config config = new AmazonS3Config
            {
                RegionEndpoint = endpoint
            };
            /*
            var username = "dlattimore@lightpointft.com";
            var password = "";
            config.ProxyCredentials = new NetworkCredential(username, password);
            */

            var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

            var s3Client = new AmazonS3Client(credentials, config);

            try
            {
                var fileTransferUtility = new TransferUtility(s3Client);

                // Option 1. Upload a File. The File Name is Used as the Object Key Name
                /*
                await fileTransferUtility.UploadAsync(filename, bucketName);
                Console.WriteLine("Upload 1 Completed");
                */

                // Option 2. Specify Object Key Name Explicitly
                await fileTransferUtility.UploadAsync(filename, bucketName, keyName);
                Console.WriteLine("Upload 2 Completed");

                // Option 3. Upload Data from a Type of System.IO.Stream
                /*
                using (var fileToUpload =
                   new FileStream(filename, FileMode.Open, FileAccess.Read))
                {
                   await fileTransferUtility.UploadAsync(fileToUpload,
                       bucketName, keyName);
                }
                Console.WriteLine("Upload 3 Completed");
                */

                // Option 4. Specify Advanced Settings
                /*
                var fileTransferUtilityRequest = new TransferUtilityUploadRequest
                {
                   BucketName = bucketName,
                   FilePath = filename,
                   StorageClass = S3StorageClass.StandardInfrequentAccess,
                   PartSize = 6291456, // 6 MB.
                   Key = keyName,
                   CannedACL = S3CannedACL.PublicRead
                };
                // User Defined Meta Data
                fileTransferUtilityRequest.Metadata.Add("Param-1", "Value-1");
                fileTransferUtilityRequest.Metadata.Add("Param-2", "Value-2");
                await fileTransferUtility.UploadAsync(fileTransferUtilityRequest);
                Console.WriteLine("Upload 4 Completed");
                */

                return true;
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when writing an object", e.Message);

                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);

                return false;
            }
        }

        private static async Task<bool> DownloadFileAsync(string filename, RegionEndpoint endpoint)
        {
            AmazonS3Config config = new AmazonS3Config
            {
                RegionEndpoint = endpoint
            };

            var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

            var s3Client = new AmazonS3Client(credentials, config);

            try
            {
                var fileTransferUtility = new TransferUtility(s3Client);

                // Download Object Using Key Name
                await fileTransferUtility.DownloadAsync(filename, bucketName, keyName);
                Console.WriteLine("Upload 2 Completed");

                return true;
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when writing an object", e.Message);

                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);

                return false;
            }
        }
    }
}