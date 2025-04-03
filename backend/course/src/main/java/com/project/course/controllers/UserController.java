package com.project.course.controllers;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.models.User;
import com.project.course.models.UserVerificationDTO;
import com.project.course.services.EmailSenderService;
import com.project.course.services.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
  private final UserService userService;
  private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
  private final EmailSenderService emailSenderService;

  @Autowired
  public UserController(UserService userService,
      EmailSenderService emailSenderService) {
    this.userService = userService;
    this.emailSenderService = emailSenderService;
  }

  @PostMapping("/login")
  public String login(@RequestBody User user) {
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
    UserVerificationDTO userVerificationDTO = new UserVerificationDTO(verificationCode);
    emailSenderService.sendEmail(user.getEmail(),
        "Spring User Account verification",
        verificationCode);
    return userService.register(user);
  }
}
