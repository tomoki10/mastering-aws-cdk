import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "ap-northeast-1" });

const createBucket = async () => {
  const command = new CreateBucketCommand({
    Bucket: "mastering-aws-cdk-sample",
  });
  await s3Client.send(command);
}

createBucket();