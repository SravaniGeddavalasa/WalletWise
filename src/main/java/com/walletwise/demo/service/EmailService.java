package com.walletwise.demo.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        log.info("Email sending started to {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            try {
                helper.setFrom(senderEmail, "WalletWise Support");
            } catch (java.io.UnsupportedEncodingException ex) {
                helper.setFrom(senderEmail);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            log.error("Authentication failed for email {}: Invalid App Password. {}", senderEmail, e.getMessage());
            throw new RuntimeException("Failed to send password recovery email: Authentication failed. Please check your App Password.");
        } catch (Exception e) {
            log.error("Email sending failed to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send password recovery email: " + e.getMessage());
        }
    }
}
