package com.project.course.services;

import com.project.course.exceptions.UserAlreadyExistsException;
import com.project.course.models.Ban;
import com.project.course.models.User;
import com.project.course.models.UserDTO;
import com.project.course.models.UserVerification;
import com.project.course.models.VerificationCodeDTO;
import com.project.course.repositories.BanRepository;
import com.project.course.repositories.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Date;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JWTService jwtService;
  private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
  private final UserVerificationCodeService userVerificationCodeService;
  private final EmailSenderService emailSenderService;
  private final BanRepository banRepository;

  @Autowired
  public UserService(UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JWTService jwtService,
      UserVerificationCodeService userVerificationCodeService,
      EmailSenderService emailSenderService,
      BanRepository banRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userVerificationCodeService = userVerificationCodeService;
    this.emailSenderService = emailSenderService;
    this.banRepository = banRepository;
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
  public ResponseEntity<?> register(UserDTO userDTO) {
    if (userRepository.existsByEmail(userDTO.getEmail())) {
      throw new UserAlreadyExistsException("User already has an account.");
    }
    User user = new User();
    user.setEmail(userDTO.getEmail());
    user.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
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
  public ResponseEntity<String> verify(UserDTO userDTO) {
    Authentication authentication;
    try {
      authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword()));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }

    Optional<User> userOptional = findByEmail(userDTO.getEmail());

    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
    Optional<Ban> banOptional = banRepository.findByEmail(userDTO.getEmail());
    if (banOptional.isPresent()) {
      Ban ban = banOptional.get();
      Date now = new Date();
      if (ban.getDate_end().after(now)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ban.getDate_start() + "|" + ban.getDate_end() + "|" + ban.getReason());
      }
    }
    User presentUser = userOptional.get();
    if (presentUser.getIsConfirmed() == '1') {
      if (authentication.isAuthenticated()) {
        String token = jwtService.generateToken(userDTO.getEmail());
        return ResponseEntity.ok(token);
      } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
      }
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not confirmed");
    }
  }

  @Transactional
  public ResponseEntity<?> authenticate(@RequestBody VerificationCodeDTO verificationCodeDTO,
      @RequestParam String email) {
    UserVerification storedVerification = userVerificationCodeService.findByEmail(email);
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      if (storedVerification != null && storedVerification
          .getVerificationCode()
          .equals(verificationCodeDTO.getVerificationCode())) {
        user.setIsConfirmed('1');
        userRepository.save(user);
        return ResponseEntity.ok("Account verified");
      }
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
  }

  @Transactional
  public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO, @PathVariable Long id) {
    Optional<User> userOptional = userRepository.findById(id);
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      user.setEmail(userDTO.getEmail());
      user.setPassword(userDTO.getPassword());
      userRepository.save(user);
      return ResponseEntity.ok(user);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
  }

  @Transactional
  public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    Optional<User> userOptional = userRepository.findById(id);
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      userRepository.delete(user);
      return ResponseEntity.status(HttpStatus.OK).body("user with id: " + id + " deleted successfully");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
    }
  }
}
