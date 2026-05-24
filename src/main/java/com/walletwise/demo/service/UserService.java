package com.walletwise.demo.service;

import com.walletwise.demo.dto.LoginRequest;
import com.walletwise.demo.dto.SignupRequest;
import com.walletwise.demo.dto.AuthResponse;
import com.walletwise.demo.entity.User;
import com.walletwise.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.security.SecureRandom;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(UserService.class);
    private static final SecureRandom secureRandom = new SecureRandom();

    public AuthResponse registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName(),
                request.getEmail(),
                encodedPassword
        );

        user = userRepository.save(user);
        
        String token = "mock-jwt-token-for-" + user.getEmail();
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                String.valueOf(user.getId()),
                user.getName(),
                user.getEmail(),
                null,
                null,
                "user"
        );
        
        return new AuthResponse(token, token, userDto);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found!");
        }

        User user = userOptional.get();

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = "mock-jwt-token-for-" + user.getEmail();
            AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                    String.valueOf(user.getId()),
                    user.getName(),
                    user.getEmail(),
                    null,
                    null,
                    "user"
            );
            return new AuthResponse(token, token, userDto);
        } else {
            throw new RuntimeException("Invalid email or password!");
        }
    }
    
    public AuthResponse.UserDto getUserProfileByToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token format");
        }
        
        String actualToken = token.substring(7);
        if (!actualToken.startsWith("mock-jwt-token-for-")) {
            throw new RuntimeException("Invalid token signature");
        }
        
        String email = actualToken.substring("mock-jwt-token-for-".length());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for token"));
                
        return new AuthResponse.UserDto(
                String.valueOf(user.getId()),
                user.getName(),
                user.getEmail(),
                null,
                null,
                "user"
        );
    }

    public User getUserByToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token format");
        }
        
        String actualToken = token.substring(7);
        if (!actualToken.startsWith("mock-jwt-token-for-")) {
            throw new RuntimeException("Invalid token signature");
        }
        
        String email = actualToken.substring("mock-jwt-token-for-".length());
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for token"));
    }
    public void sendPasswordRecoveryEmail(String email) {
        log.info("Request to send password recovery OTP to {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Password recovery failed: email {} not found", email);
                    return new RuntimeException("User not found");
                });

        log.info("User found with email: {}", email);

        // Generate 6-digit OTP
        int otpValue = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(otpValue);
        log.info("OTP generated: {} for user: {}", otp, email);
        
        user.setResetOtp(otp);
        user.setOtpExpiry(OffsetDateTime.now().plusMinutes(5));
        userRepository.save(user);

        log.info("For local testing, the OTP for {} is: {}", email, otp);
        
        emailService.sendOtpEmail(email, otp);

        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) {
            smsService.sendSms(user.getPhoneNumber(), "Your WalletWise password reset OTP is: " + otp + ". Valid for 5 minutes.");
        }
    }

    public void verifyOtp(String email, String otp) {
        log.info("Request to verify OTP for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String cleanOtp = otp != null ? String.valueOf(otp).trim() : "";
        String storedOtp = user.getResetOtp() != null ? String.valueOf(user.getResetOtp()).trim() : "";
        
        log.info("Verifying OTP for {}. Stored OTP: '{}', Entered OTP: '{}'", email, storedOtp, cleanOtp);

        if (storedOtp.isEmpty() || !storedOtp.equalsIgnoreCase(cleanOtp)) {
            log.error("OTP verification failed: invalid OTP for user {}", email);
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(OffsetDateTime.now())) {
            log.error("OTP verification failed: OTP expired for user {}", email);
            throw new RuntimeException("OTP has expired.");
        }
        
        log.info("OTP verified successfully for user {}", email);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        log.info("Request to reset password for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String cleanOtp = otp != null ? String.valueOf(otp).trim() : "";
        String storedOtp = user.getResetOtp() != null ? String.valueOf(user.getResetOtp()).trim() : "";
        
        log.info("Resetting password for {}. Stored OTP: '{}', Entered OTP: '{}'", email, storedOtp, cleanOtp);

        if (storedOtp.isEmpty() || !storedOtp.equalsIgnoreCase(cleanOtp)) {
            log.error("Password reset failed: invalid OTP for user {}", email);
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(OffsetDateTime.now())) {
            log.error("Password reset failed: OTP expired");
            throw new RuntimeException("OTP has expired.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        log.info("Password reset successfully for user {}", email);
    }
}
