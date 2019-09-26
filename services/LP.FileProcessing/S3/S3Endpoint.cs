using Amazon;
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
        private const string bucketName = "lattimore.drop";
        private const string keyName = "uploaded-data";
        private const string accessKeyId = "";
        private const string secretAccessKey = "";

        // Specify your bucket region (an example region is shown).
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast2;

        public static void Upload(string filePath)
        {
            UploadFileAsync(filePath, bucketRegion).Wait();
        }

        private static async Task UploadFileAsync(string filename, RegionEndpoint endpoint)
        {
            AmazonS3Config config = new AmazonS3Config
            {
                RegionEndpoint = endpoint
            };
//            var username = "dlattimore@lightpointft.com";
//            var password = "";
//            
//            config.ProxyCredentials = new NetworkCredential(username, password);

            var credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

            var s3Client = new AmazonS3Client(credentials, config);

            try
            {
                var fileTransferUtility = new TransferUtility(s3Client);

                // Option 1. Upload a file. The file name is used as the object key name.
                await fileTransferUtility.UploadAsync(filename, bucketName);
                Console.WriteLine("Upload 1 Completed");

                // Option 2. Specify object key name explicitly.
                await fileTransferUtility.UploadAsync(filename, bucketName, keyName);
                Console.WriteLine("Upload 2 Completed");

                // Option 3. Upload data from a type of System.IO.Stream.
                using (var fileToUpload =
                    new FileStream(filename, FileMode.Open, FileAccess.Read))
                {
                    await fileTransferUtility.UploadAsync(fileToUpload,
                        bucketName, keyName);
                }

                Console.WriteLine("Upload 3 Completed");

                // Option 4. Specify advanced settings.
                var fileTransferUtilityRequest = new TransferUtilityUploadRequest
                {
                    BucketName = bucketName,
                    FilePath = filename,
                    StorageClass = S3StorageClass.StandardInfrequentAccess,
                    PartSize = 6291456, // 6 MB.
                    Key = keyName,
                    CannedACL = S3CannedACL.PublicRead
                };
                fileTransferUtilityRequest.Metadata.Add("param1", "Value1");
                fileTransferUtilityRequest.Metadata.Add("param2", "Value2");

                await fileTransferUtility.UploadAsync(fileTransferUtilityRequest);
                Console.WriteLine("Upload 4 Completed");
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when writing an object", e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);
            }
        }
    }
}