package com.summary.eSummarizer.Controller;

import com.summary.eSummarizer.Model.UserModel;
import com.summary.eSummarizer.Repository.MyAppUserRepository;
import com.summary.eSummarizer.Service.MyAppUserService;
import com.summary.eSummarizer.Service.UserOperationService;

import java.time.LocalDateTime;
import java.util.Optional;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private MyAppUserService userService;

    @Autowired
    private UserOperationService userOperationService;
    @Autowired
    private MyAppUserRepository myAppUserRepository;

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
}