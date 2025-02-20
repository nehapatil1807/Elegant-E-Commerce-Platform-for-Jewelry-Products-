using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;

namespace ElegantJewellery.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly IConfiguration _configuration;

        public EmailService(IOptions<EmailSettings> emailSettings, IConfiguration configuration)
        {
            _emailSettings = emailSettings.Value;
            _configuration = configuration;
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string userName, string resetToken)
        {
            // Get the client URL from configuration
            var clientUrl = "http://localhost:5173"; // or get from configuration
            var resetUrl = $"{clientUrl}/reset-password?token={resetToken}";

            var subject = "Reset Your Password - Elegant Jewellery";
            var body = $@"
            <h2>Hello {userName},</h2>
            <p>We received a request to reset your password. Click the link below to set a new password:</p>
            <p><a href='{resetUrl}' style='display: inline-block; background-color: #B4833E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
            <p>If you can't click the button, copy and paste this URL into your browser:</p>
            <p>{resetUrl}</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>The link will expire in 30 minutes for security reasons.</p>
            <br>
            <p>Best regards,</p>
            <p>The Elegant Jewellery Team</p>";

            await SendEmailAsync(toEmail, subject, body);
        }


        public async Task SendPasswordChangeConfirmationAsync(string toEmail, string userName)
        {
            var subject = "Password Changed Successfully - Elegant Jewellery";
            var body = $@"
            <h2>Hello {userName},</h2>
            <p>Your password has been successfully changed.</p>
            <p>If you didn't make this change, please contact our support team immediately.</p>
            <br>
            <p>Best regards,</p>
            <p>The Elegant Jewellery Team</p>";

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            using var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
            {
                Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            await client.SendMailAsync(message);
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string userName)
        {
            var subject = "Welcome to Elegant Jewellery!";
            var body = $@"
                <h2>Welcome to Elegant Jewellery, {userName}!</h2>
                <p>Thank you for registering with us. We're excited to have you as part of our community.</p>
                <p>Start exploring our collection of exquisite jewellery pieces designed just for you.</p>
                <p>If you have any questions, feel free to contact our customer support.</p>
                <br>
                <p>Best regards,</p>
                <p>The Elegant Jewellery Team</p>";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendOrderConfirmationAsync(string toEmail, string userName, int orderId, string orderStatus)
        {
            var subject = $"Order Confirmation - Order #{orderId}";
            var body = $@"
                <h2>Thank you for your order, {userName}!</h2>
                <p>Your order #{orderId} has been successfully placed and is currently {orderStatus}.</p>
                <p>We will process your order soon and keep you updated on its status.</p>
                <p>You can track your order status by logging into your account.</p>
                <br>
                <p>Best regards,</p>
                <p>The Elegant Jewellery Team</p>";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendOrderStatusUpdateAsync(string toEmail, string userName, int orderId, string newStatus)
        {
            var subject = $"Order Status Update - Order #{orderId}";
            var body = $@"
                <h2>Hello {userName},</h2>
                <p>Your order #{orderId} status has been updated to: {newStatus}</p>
                <p>You can track your order status by logging into your account.</p>
                <br>
                <p>Best regards,</p>
                <p>The Elegant Jewellery Team</p>";

            await SendEmailAsync(toEmail, subject, body);
        }
    }
}

