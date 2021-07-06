import aws from "aws-sdk";
import { phoneNum } from "../secrets.json";

const secrets =
    process.env.NODE_ENV === "production"
        ? process.env
        : require("../secrets.json");

const sns = new aws.SNS({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

export const sendSMS = (text) => {
    const params = {
        Message: text,
        PhoneNumber: phoneNum,
    };

    return sns.publish(params).promise();
};
