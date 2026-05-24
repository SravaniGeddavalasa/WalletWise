package com.walletwise.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${emailjs.service.id}")
    private String serviceId;

    @Value("${emailjs.template.id}")
    private String templateId;

    @Value("${emailjs.public.key}")
    private String publicKey;

    @Value("${emailjs.private.key}")
    private String privateKey;

    public void sendOtpEmail(String to, String otp) {
        log.info("Attempting to send email via EmailJS API to {}", to);
        
        try {
            String url = "https://api.emailjs.com/api/v1.0/email/send";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> templateParams = new HashMap<>();
            templateParams.put("to_email", to);
            templateParams.put("otp", otp);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("service_id", serviceId);
            requestBody.put("template_id", templateId);
            requestBody.put("user_id", publicKey);
            requestBody.put("accessToken", privateKey);
            requestBody.put("template_params", templateParams);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent successfully via EmailJS to {}", to);
            } else {
                log.error("EmailJS returned an error: {}", response.getBody());
                throw new RuntimeException("EmailJS failed to send email.");
            }
        } catch (Exception e) {
            log.error("Failed to connect to EmailJS API: {}", e.getMessage());
            throw new RuntimeException("Failed to send password recovery email via API.");
        }
    }
}
