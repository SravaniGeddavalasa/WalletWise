package com.walletwise.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    public void sendSms(String phoneNumber, String message) {
        log.info("SMS sending started to {}", phoneNumber);
        try {
            // TODO: Integrate Twilio or MSG91 here.
            // For now, operating in dry-run mode and logging the message safely.
            log.info("DRY-RUN SMS to {}: {}", phoneNumber, message);
            log.info("SMS sent successfully to {}", phoneNumber);
        } catch (Exception e) {
            log.error("SMS sending failed to {}: {}", phoneNumber, e.getMessage());
            throw new RuntimeException("Failed to send SMS: " + e.getMessage());
        }
    }
}
