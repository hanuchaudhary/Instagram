"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (toEmail, verifyCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
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
        const info = yield transporter.sendMail({
            from: 'no-reply@yourdomain.com',
            to: toEmail,
            subject: "Your Verification Code",
            html: htmlContent,
        });
        return info;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
});
exports.sendEmail = sendEmail;
