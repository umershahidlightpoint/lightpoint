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
        private static IAmazonS3 S3Client { get; set; }

        // Credentials
        private const string BucketName = "lattimore.drop";
        private const string KeyName = "uploaded-data";

        public S3Endpoint(AmazonS3Client amazonS3Client)
        {
            S3Client = amazonS3Client;
        }

        public bool UploadFileToS3(string filePath)
        {
            return UploadFileAsync(S3Client, filePath).GetAwaiter().GetResult();
        }

        public bool DownloadFileFromS3(string filePath)
        {
            return DownloadFileAsync(S3Client, filePath).GetAwaiter().GetResult();
        }

        public List<object> ListS3Files()
        {
            return ListFilesAsync(S3Client).GetAwaiter().GetResult();
        }

        private static async Task<bool> UploadFileAsync(IAmazonS3 amazonS3Client, string filePath)
        {
            try
            {
                var fileTransferUtility = new TransferUtility(amazonS3Client);

                // Option 1. Upload a File. The File Name is Used as the Object Key Name
                /*
                await fileTransferUtility.UploadAsync(filePath, bucketName);
                Console.WriteLine("Upload 1 Completed");
                */

                // Option 2. Specify Object Key Name Explicitly
                await fileTransferUtility.UploadAsync(filePath, BucketName, KeyName);
                Console.WriteLine("Upload 2 Completed");

                // Option 3. Upload Data from a Type of System.IO.Stream
                /*
                using (var fileToUpload =
                   new FileStream(filePath, FileMode.Open, FileAccess.Read))
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
                   FilePath = filePath,
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

        private static async Task<bool> DownloadFileAsync(IAmazonS3 amazonS3Client, string filePath)
        {
            try
            {
                var fileTransferUtility = new TransferUtility(amazonS3Client);

                // Download Object Using Key Name
                await fileTransferUtility.DownloadAsync(filePath, BucketName, KeyName);
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

        private static async Task<List<object>> ListFilesAsync(IAmazonS3 amazonS3Client)
        {
            List<object> files = new List<object>();

            try
            {
                ListObjectsV2Request request = new ListObjectsV2Request
                {
                    BucketName = BucketName
                };

                ListObjectsV2Response response;
                do
                {
                    response = await amazonS3Client.ListObjectsV2Async(request);

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