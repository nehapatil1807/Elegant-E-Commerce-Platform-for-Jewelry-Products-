package com.cdac.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger LOGGER = Logger.getLogger(EmailService.class.getName());
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationEmail(String toEmail, String firstName) {
        String subject = "🎉 Welcome to Elegant Jewelry - Your Luxury Shopping Experience Begins!";

        String body = "<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; max-width: 600px;\">" +
                
                // Greeting Section
                "<h1 style=\"color: #D4AF37; text-align: center;\">Hi " + firstName + ",</h1>" +
                
                "<p style=\"font-size: 16px; color: #555;\">We are delighted to welcome you to <strong>Elegant Jewelry</strong>. " +
                "Your journey into the world of timeless elegance and luxury begins today! ✨</p>" +

                "<p style=\"font-size: 16px; color: #555;\">At <strong>Elegant Jewelry</strong>, we believe that jewelry is more than just an accessory; " +
                "it’s a reflection of your personality, style, and the moments that matter most to you. Whether you're looking for the perfect piece to complement your outfit " +
                "or a meaningful gift for someone special, we've got you covered.</p>" +

                // Benefits Section
                "<h3 style=\"color: #333;\">💎 As a Valued Member, You Get:</h3>" +
                "<ul style=\"font-size: 16px; color: #555;\">" +
                "<li>✨ Exclusive access to limited-edition collections</li>" +
                "<li>🎁 Member-only discounts and early access to new arrivals</li>" +
                "<li>💎 Personalized recommendations tailored to your unique style</li>" +
                "<li>📦 Fast, secure, and insured shipping on all orders</li>" +
                "<li>🛠 Expert jewelry care tips & styling guides</li>" +
                "</ul>" +

                "<p style=\"font-size: 16px; color: #555;\">We have a stunning selection of rings, necklaces, bracelets, earrings, and more. " +
                "Start exploring now and discover a piece that truly defines your elegance.</p>" +

				 // CTA Button (Now Using Your Store Link)
				 "<div style=\"text-align: center; margin: 20px 0;\">" +
				 "<a href=\"https://elegantjewellary.vercel.app/\" target=\"_blank\" " +
				 "style=\"background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; " +
				 "font-size: 16px; border-radius: 5px; font-weight: bold;\">✨ Visit Our Store ✨</a>" +
				 "</div>" +
				 
                // Customer Support Section
                "<h3 style=\"color: #333;\">📞 Need Assistance?</h3>" +
                "<p style=\"font-size: 16px; color: #555;\">We are always here to help! If you have any questions about your account, " +
                "our jewelry collections, or need assistance with your first order, feel free to reach out to our friendly support team.</p>" +

                "<p style=\"font-size: 16px; color: #555;\"><strong>📧 Email:</strong> <a href=\"mailto:support@elegantjewelry.com\">support@elegantjewelry.com</a></p>" +
                "<p style=\"font-size: 16px; color: #555;\"><strong>📞 Customer Care:</strong> +1-800-123-4567</p>" +

                "<p style=\"font-size: 16px; color: #555;\">Follow us on social media to stay updated on new arrivals, exclusive offers, and jewelry styling tips.</p>" +

                "<p style=\"text-align: center;\">" +
                "<a href=\"https://www.instagram.com/elegantjewelry\" target=\"_blank\" style=\"text-decoration: none;\">📸 Instagram</a> | " +
                "<a href=\"https://www.facebook.com/elegantjewelry\" target=\"_blank\" style=\"text-decoration: none;\">📘 Facebook</a> | " +
                "<a href=\"https://www.twitter.com/elegantjewelry\" target=\"_blank\" style=\"text-decoration: none;\">🐦 Twitter</a>" +
                "</p>" +

                "<hr style=\"border: 0; height: 1px; background: #ccc;\"/>" +

                // Closing Message
                "<p style=\"font-size: 16px; color: #555; text-align: center;\">" +
                "Thank you for choosing <strong>Elegant Jewelry</strong>. We can't wait to be a part of your style journey! 💎</p>" +

                "<p style=\"font-size: 14px; color: #888; text-align: center;\">💎 Elegant Jewelry | Timeless Elegance, Crafted for You 💎</p>" +
                
                "</div>";

        sendEmail(toEmail, subject, body);
    }


    private void sendEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);  // Enable HTML content
            helper.setFrom("your_email@gmail.com"); // Ensure the sender's email is set

            mailSender.send(message);
            LOGGER.info("Email sent successfully to " + toEmail);
        } catch (MessagingException e) {
            LOGGER.log(Level.SEVERE, "Error sending email", e);
        }
    }
}
