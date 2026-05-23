package com.walletwise.demo.controller;

import com.walletwise.demo.dto.ApiResponse;
import com.walletwise.demo.dto.AuthResponse;
import com.walletwise.demo.dto.LoginRequest;
import com.walletwise.demo.dto.SignupRequest;
import com.walletwise.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody SignupRequest request) {
        try {
            AuthResponse response = userService.registerUser(request);
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(true, "User registered successfully.", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.authenticateUser(request);
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(true, "Login successful", response);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<AuthResponse> apiResponse = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            AuthResponse.UserDto userDto = userService.getUserProfileByToken(token);
            Map<String, Object> data = new HashMap<>();
            data.put("user", userDto);
            ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>(true, "Profile fetched successfully", data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email is required.");
            }
            userService.sendPasswordRecoveryEmail(email);
            ApiResponse<String> apiResponse = new ApiResponse<>(true, "Recovery code sent successfully", null);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody Map<String, Object> request) {
        try {
            String email = request.get("email") != null ? String.valueOf(request.get("email")).trim() : null;
            String otp = request.get("otp") != null ? String.valueOf(request.get("otp")).trim() : null;
            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email is required.");
            }
            if (otp == null || otp.isEmpty()) {
                throw new RuntimeException("OTP is required.");
            }
            userService.verifyOtp(email, otp);
            ApiResponse<String> apiResponse = new ApiResponse<>(true, "OTP verified successfully", null);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody Map<String, Object> request) {
        try {
            String email = request.get("email") != null ? String.valueOf(request.get("email")).trim() : null;
            String otp = request.get("otp") != null ? String.valueOf(request.get("otp")).trim() : null;
            String password = request.get("password") != null ? String.valueOf(request.get("password")).trim() : null;
            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email is required.");
            }
            if (otp == null || otp.isEmpty()) {
                throw new RuntimeException("OTP is required.");
            }
            if (password == null || password.isEmpty()) {
                throw new RuntimeException("Password is required.");
            }
            userService.resetPassword(email, otp, password);
            ApiResponse<String> apiResponse = new ApiResponse<>(true, "Password updated successfully", null);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }
}
