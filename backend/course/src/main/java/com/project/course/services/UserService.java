package com.project.course.services;

import com.project.course.exceptions.UserAlreadyExistsException;
import com.project.course.models.User;
import com.project.course.models.UserDTO;
import com.project.course.models.UserVerification;
import com.project.course.repositories.UserRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JWTService jwtService;
  private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
  private final UserVerificationCodeService userVerificationCodeService;
  private final EmailSenderService emailSenderService;

  @Autowired
  public UserService(UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JWTService jwtService,
      UserVerificationCodeService userVerificationCodeService,
      EmailSenderService emailSenderService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userVerificationCodeService = userVerificationCodeService;
    this.emailSenderService = emailSenderService;
  }

  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public void save(User user) {
    userRepository.save(user);
  }

  public static String generateCode() {
    Random random = new Random();
    StringBuilder code = new StringBuilder();
    for (int i = 0; i < 6; i++) {
      code.append(random.nextInt(10));
    }
    return code.toString();
  }

  @Transactional
  public ResponseEntity<?> register(User user) {
    if (userRepository.existsByEmail(user.getEmail())) {
      throw new UserAlreadyExistsException("User already has an account.");
    }

    user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
    user.setRoles("USER");
    user.setIsConfirmed('0');
    String verificationCode = generateCode();
    UserVerification userVerification = new UserVerification();
    userVerification.setEmail(user.getEmail());
    userVerification.setVerificationCode(verificationCode);

    userVerificationCodeService.save(userVerification);
    emailSenderService.sendEmail(user.getEmail(), "Spring User Account verification", verificationCode);
    userRepository.save(user);

    return ResponseEntity.status(HttpStatus.CREATED).body(user);
  }

  @Transactional
  public ResponseEntity<String> verify(User user) {
    Authentication authentication;
    try {
      authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }

    Optional<User> userOptional = findByEmail(user.getEmail());

    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    User presentUser = userOptional.get();
    if (presentUser.getIsConfirmed() == '1') {
      if (authentication.isAuthenticated()) {
        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(token);
      } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
      }
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not confirmed");
    }
  }
}
