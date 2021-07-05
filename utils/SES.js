import aws from "aws-sdk";
import { myEmail } from "../secrets.json";

const email = process.env.myEmail || myEmail;

const secrets =
    process.env.NODE_ENV === "production"
        ? process.env
        : require("../secrets.json");

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

module.exports.sendEmail = (recipient, subject, message) => {
    ses.sendEmail({
        Source: email,
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Data: message,
                },
            },
            Subject: {
                Data: subject,
            },
        },
    })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
