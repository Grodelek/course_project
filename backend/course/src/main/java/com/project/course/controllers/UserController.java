package com.project.course.controllers;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.models.User;
import com.project.course.models.UserVerification;
import com.project.course.models.VerificationCodeDTO;
import com.project.course.services.UserService;
import com.project.course.services.UserVerificationCodeService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
  private final UserService userService;
  private final UserVerificationCodeService userVerificationCodeService;

  @Autowired
  public UserController(
      UserService userService,
      UserVerificationCodeService userVerificationCodeService) {
    this.userService = userService;
    this.userVerificationCodeService = userVerificationCodeService;
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody User user) {
    return userService.verify(user);
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User user) {
    return userService.register(user);
  }

  @PostMapping("/authenticate")
  public String authenticate(@RequestBody VerificationCodeDTO verificationCode, @RequestParam String email) {
    UserVerification storedVerification = userVerificationCodeService.findByEmail(email);
    Optional<User> userOptional = userService.findByEmail(email);

    if (userOptional.isPresent()) {
      User user = userOptional.get();
      if (storedVerification != null
          && storedVerification.getVerificationCode().equals(verificationCode.getVerificationCode())) {
        user.setIsConfirmed('1');
        userService.save(user);
        return "Account verified";
      }
      return "Invalid verification code"; // Added this for clarity
    } else {
      return "Failed";
    }
  }
}
