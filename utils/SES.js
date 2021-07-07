import aws from "aws-sdk";

const ses = new aws.SES({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "eu-central-1",
});

export const sendEmail = (recipient, subject, message) => {
    ses.sendEmail({
        Source: process.env.myEmail,
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
