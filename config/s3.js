require('dotenv').config();
const env = process.env;

const s3_info = {
    accessKeyId: env.S3_ACCESSKEYID,
    secretAccessKey: env.S3_SECRETACCESSKEY,
    region: env.S3_REGION,
};

module.exports = { s3_info };