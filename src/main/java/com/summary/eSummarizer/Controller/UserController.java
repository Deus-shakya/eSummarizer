package com.summary.eSummarizer.Controller;

import com.summary.eSummarizer.Model.UserModel;
import com.summary.eSummarizer.Repository.MyAppUserRepository;
import com.summary.eSummarizer.Service.MyAppUserService;
import com.summary.eSummarizer.Service.UserOperationService;

import java.time.LocalDateTime;
import java.util.Optional;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private MyAppUserService userService;

    @Autowired
    private UserOperationService userOperationService;
    @Autowired
    private MyAppUserRepository myAppUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<UserModel> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserModel user = userService.findByEmail(auth.getName());
        System.out.println("thisIsUser: " + user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/username")
    public ResponseEntity<?> updateUsername(@RequestParam String newUsername) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            userService.updateUsername(auth.getName(), newUsername);
            return ResponseEntity.ok().body("Username updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        try {
            userOperationService.changePassword(auth.getName(), oldPassword, newPassword);
            return ResponseEntity.ok().body("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateprofile")
    public ResponseEntity<?> updateProfile(@RequestParam("firstname") String firstname,
            @RequestParam(value = "middlename", required = false) String middlename,
            @RequestParam("lastname") String lastname,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone) {
        Optional<UserModel> optionalUser = myAppUserRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User doesnt Exist!");
        }
        UserModel user = optionalUser.get();
        user.setFirstName(firstname);
        user.setMiddleName(middlename);
        user.setLastName(lastname);
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setUpdatedAt(LocalDateTime.now());

        myAppUserRepository.save(user);
        return ResponseEntity.ok("User updated successfully!");

    }

    @PatchMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword,
            @RequestParam("confirmPassword") String confirmPassword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserModel user = userService.findByEmail(auth.getName());
        String password = user.getPassword();
        if (!passwordEncoder.matches(currentPassword, password)) {
            return ResponseEntity.status(400).body("Wrong current password!");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        myAppUserRepository.save(user);

        return ResponseEntity.ok("New password saved successfully!");
    }

    @PatchMapping(value = "/updateavatar", consumes = "multipart/form-data")
    public ResponseEntity<?> updateAvatar(@RequestParam("avatar") MultipartFile avatar) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserModel user = userService.findByEmail(auth.getName());

        if (avatar == null || avatar.isEmpty()) {
            return ResponseEntity.badRequest().body("No image uploaded.");
        }

        // Delete old image if exists
        String oldImageUrl = user.getProfileImageUrl();
        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            String oldImagePath = "src/main/resources/static" + oldImageUrl;
            java.nio.file.Path oldPath = java.nio.file.Paths.get(oldImagePath).toAbsolutePath();
            try {
                java.nio.file.Files.deleteIfExists(oldPath);
            } catch (Exception ex) {
                ex.printStackTrace();
                // Optionally log but don't fail the request
            }
        }

        String uploadDir = "src/main/resources/static/uploads";
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir).toAbsolutePath();
        String fileName = System.currentTimeMillis() + "_" + avatar.getOriginalFilename();

        try {
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            avatar.transferTo(filePath.toFile());
            String profileImageUrl = "/uploads/" + fileName;
            user.setProfileImageUrl(profileImageUrl);
            myAppUserRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save profile image");
        }
    }

    @DeleteMapping("/deleteuser")
    public ResponseEntity<?> deleteUser(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserModel user = userService.findByEmail(auth.getName());
        if (user == null) {
            return ResponseEntity.status(400).body("User doesnt exist!");
        }
        myAppUserRepository.delete(user);
        request.getSession().invalidate(); // Destroy session
        return ResponseEntity.ok("User deleted Successfully!");
    }
}