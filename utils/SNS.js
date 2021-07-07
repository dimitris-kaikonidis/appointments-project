import aws from "aws-sdk";

const sns = new aws.SNS({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "eu-central-1",
});

export const sendSMS = (text) => {
    const params = {
        Message: text,
        PhoneNumber: process.env.phoneNum,
    };

    return sns.publish(params).promise();
};
