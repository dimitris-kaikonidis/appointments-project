import aws from "aws-sdk";
const email = process.env.myEmail || require("../secrets.json").myEmail;

const secrets =
    process.env.NODE_ENV === "production"
        ? process.env
        : require("../secrets.json");

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

export const sendEmail = (recipient, subject, message) => {
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
