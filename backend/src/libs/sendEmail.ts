import nodemailer from 'nodemailer'
export const sendEmail = async (toEmail: string, verifyCode: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "ef08c57eb8763c",
                pass: "81017c45bc8969"
            }
        });

        const htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333;">Verify Your Account</h2>
                        <p>Thank you for signing up! Please use the following verification code to complete your registration:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">${verifyCode}</p>
                        <p style="color: #555;">This code will expire in 1 hour. If you did not request this code, please ignore this email.</p>
                        <p style="color: #777; font-size: 12px;">Best regards, <br> The Team</p>
                    </div>
                </body>
            </html>
        `;

        const info = await transporter.sendMail({
            from: 'no-reply@yourdomain.com',
            to: toEmail,
            subject: "Your Verification Code",
            html: htmlContent,
        });

        return info;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
};
