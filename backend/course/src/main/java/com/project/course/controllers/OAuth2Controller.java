package com.project.course.controllers;

import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.dto.UserPasswordResetDTO;
import com.project.course.models.User;
import com.project.course.services.UserService;

@RestController
public class OAuth2Controller {
  private UserService userService;
  private final PasswordEncoder passwordEncoder;

  OAuth2Controller(UserService userService, PasswordEncoder passwordEncoder) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
  }

  @GetMapping("/oauth2/reset-password")
  public String view() {
    return "change password";
  }

  @PostMapping("/oauth2/reset-password")
  public ResponseEntity<?> oAuth2ResetPassword(@RequestBody UserPasswordResetDTO userDTO, @RequestParam String email) {
    Optional<User> userOptional = userService.findByEmail(email);
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
      userService.save(user);
      return ResponseEntity.ok().body("Password changed successfully");
    }
    return ResponseEntity.badRequest().body("User not found");
  }
}
