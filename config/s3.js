const env = process.env;
const aws = require('aws-sdk');
require('dotenv').config();

aws.config.update({
    accessKeyId: env.S3_ACCESSKEYID,
    secretAccessKey: env.S3_SECRETACCESSKEY,
    region: env.S3_REGION
});
const s3 = new aws.S3();
module.exports = {
    aws,
    s3,
    s3bucket: env.S3_BUCKET
}