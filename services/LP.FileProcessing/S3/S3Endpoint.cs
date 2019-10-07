using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;

namespace LP.FileProcessing.S3
{
    public class S3Endpoint
    {
        // Credentials
        private const string bucketName = "lattimore.drop";
        private const string keyName = "uploaded-data";
//        private const string accessKeyId = "";
//        private const string secretAccessKey = "";

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

        public static List<object> List()
        {
            return ListFilesAsync(bucketRegion).GetAwaiter().GetResult();
        }

        private static async Task<bool> UploadFileAsync(string filename, RegionEndpoint endpoint)
        {
            AmazonS3Config config = new AmazonS3Config
            {
                RegionEndpoint = endpoint,
                ForcePathStyle = true,
            };
            /*
            var username = "dlattimore@lightpointft.com";
            var password = "";
            config.ProxyCredentials = new NetworkCredential(username, password);
            */

//            var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

            var s3Client = new AmazonS3Client(config);

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

            var s3Client = new AmazonS3Client(config);

            try
            {
                var fileTransferUtility = new TransferUtility(s3Client);

                // Download Object Using Key Name
                await fileTransferUtility.DownloadAsync(filename, bucketName, keyName);
                Console.WriteLine("Download Completed");

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

        private static async Task<List<object>> ListFilesAsync(RegionEndpoint endpoint)
        {
            AmazonS3Config config = new AmazonS3Config
            {
                RegionEndpoint = endpoint
            };

            var s3Client = new AmazonS3Client(config);

            List<object> files = new List<object>();

            try
            {
                ListObjectsV2Request request = new ListObjectsV2Request
                {
                    BucketName = bucketName
                };

                ListObjectsV2Response response;
                do
                {
                    response = await s3Client.ListObjectsV2Async(request);

                    // Process the Response
                    foreach (S3Object entry in response.S3Objects)
                    {
                        files.Add(new
                        {
                            Name = entry.Key,
                            UploadDate = entry.LastModified.ToString("u"),
                            entry.Size
                        });
                    }

                    request.ContinuationToken = response.NextContinuationToken;
                } while (response.IsTruncated);

                return files
                    .OrderByDescending(option => option?.GetType().GetProperty("UploadDate")?.GetValue(option, null))
                    .ToList();
            }
            catch (AmazonS3Exception amazonS3Exception)
            {
                Console.WriteLine("S3 Error Occurred. Exception: " + amazonS3Exception.ToString());

                return files;
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.ToString());

                return files;
            }
        }
    }
}