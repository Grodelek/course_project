package com.project.course.controllers;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.models.User;
import com.project.course.models.UserVerification;
import com.project.course.models.VerificationCodeDTO;
import com.project.course.services.EmailSenderService;
import com.project.course.services.UserService;
import com.project.course.services.UserVerificationCodeService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
  private final UserService userService;
  private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
  private final EmailSenderService emailSenderService;
  private UserVerification userVerification;
  private VerificationCodeDTO verificationCodeDTO;
  private final UserVerificationCodeService userVerificationCodeService;

  @Autowired
  public UserController(
      UserService userService,
      EmailSenderService emailSenderService,
      UserVerificationCodeService userVerificationCodeService) {
    this.userService = userService;
    this.emailSenderService = emailSenderService;
    this.userVerificationCodeService = userVerificationCodeService;
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody User user) {
    return userService.verify(user);
  }

  public static String generateCode() {
    Random random = new Random();
    StringBuilder code = new StringBuilder();
    for (int i = 0; i < 6; i++) {
      code.append(random.nextInt(10));
    }
    return code.toString();
  }

  @PostMapping("/register")
  public User register(@RequestBody User user) {
    user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
    user.setRoles("USER");
    user.setIsConfirmed('0');
    String verificationCode = generateCode();
    UserVerification userVerification = new UserVerification();
    userVerification.setEmail(user.getEmail());
    userVerification.setVerificationCode(verificationCode);
    userVerificationCodeService.save(userVerification);
    emailSenderService.sendEmail(user.getEmail(), "Spring User Account verification", verificationCode);
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
