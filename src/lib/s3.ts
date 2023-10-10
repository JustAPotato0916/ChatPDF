import AWS from "aws-sdk"

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        })
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: "ap-southeast-1"
        })

        const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-")

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file
        }

        const upload = s3.putObject(params).on("httpUploadProgress", (progress) => {
            console.log("Uploading to S3...", parseInt(((progress.loaded / progress.total) * 100).toString()) + "%")
        }).promise()

        await upload.then((data) => {
            console.log("Successfully uploaded to S3!", file_key)
        })

        return Promise.resolve({
            file_key,
            file_name: file.name,
        })

    } catch (error) { }
}

export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/${file_key}`
}
