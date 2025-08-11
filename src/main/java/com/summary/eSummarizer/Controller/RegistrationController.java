package com.summary.eSummarizer.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.summary.eSummarizer.Model.UserModel;
import com.summary.eSummarizer.Repository.MyAppUserRepository;

import java.time.LocalDateTime;

@RestController
public class RegistrationController {

    @Autowired
    private MyAppUserRepository myAppUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/signup", consumes = "multipart/form-data")
    public ResponseEntity<?> createUser(
            @RequestParam("firstname") String firstname,
            @RequestParam(value = "middlename", required = false) String middlename,
            @RequestParam("lastname") String lastname,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        if (myAppUserRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists");
        }

        if (password.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password must be at least 8 characters long");
        }

        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            String uploadDir = "src/main/resources/static/uploads";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir).toAbsolutePath();
            String fileName = System.currentTimeMillis() + "_" + profileImage.getOriginalFilename();

            try {
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Path filePath = uploadPath.resolve(fileName);
                profileImage.transferTo(filePath.toFile());
                profileImageUrl = "/uploads/" + fileName; // For web access
            } catch (Exception ex) {
                ex.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to save profile image");
            }
        }

        UserModel user = new UserModel();
        user.setFirstName(firstname);
        user.setMiddleName(middlename);
        user.setLastName(lastname);
        user.setCreatedAt(LocalDateTime.now());
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setProfileImageUrl(profileImageUrl);

        UserModel savedUser = myAppUserRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
