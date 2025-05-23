package com.project.course.services;

import com.project.course.dto.ResetPasswordDTO;
import com.project.course.dto.UserDTO;
import com.project.course.dto.VerificationCodeDTO;
import com.project.course.exceptions.UserAlreadyExistsException;
import com.project.course.models.*;
import com.project.course.repositories.BanRepository;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.LessonRepository;
import com.project.course.repositories.UserRepository;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
  private final LessonRepository lessonRepository;

  public UserService(UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JWTService jwtService,
      UserVerificationCodeService userVerificationCodeService,
      EmailSenderService emailSenderService,
      BanRepository banRepository,
      LessonRepository lessonRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userVerificationCodeService = userVerificationCodeService;
    this.emailSenderService = emailSenderService;
    this.banRepository = banRepository;
    this.lessonRepository = lessonRepository;
  }

  @Autowired
  private CourseRepository courseRepository;

  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public void save(User user) {
    userRepository.save(user);
  }

  public static String generateCode() {
    Random random = new Random();
    return IntStream.range(0, 6)
        .map(i -> random.nextInt(10))
        .mapToObj(String::valueOf)
        .collect(Collectors.joining());
  }

  @Transactional
  public ResponseEntity<?> register(UserDTO userDTO) {
    if (userRepository.existsByEmail(userDTO.getEmail())) {
      throw new UserAlreadyExistsException("User already has an account.");
    }
    User user = new User();
    user.setUsername(userDTO.getUsername());
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
      if (ban.getDateEnd().isAfter(LocalDate.now())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ban.getDateStart() + "|" + ban.getDateEnd() + "|" + ban.getReason());
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

  @Transactional
  public ResponseEntity<?> addFinishedCourseByEmail(String email, Long courseId) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    Optional<Course> courseOptional = courseRepository.findById(courseId);

    if (userOptional.isPresent() && courseOptional.isPresent()) {
      User user = userOptional.get();
      Course course = courseOptional.get();

      if (!user.getFinishedCoursesList().contains(course)) {
        user.getFinishedCoursesList().add(course);
        userRepository.save(user);
      }

      return ResponseEntity.ok("Course added to finished list.");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Course not found.");
    }
  }

  public List<Long> getFinishedCourseIdsByEmail(String email) {
    return userRepository.findFinishedCourseIdsByUserEmail(email);
  }

  public List<Long> getFinishedLessonsIdsByEmail(String email) {
    return userRepository.findFinishedLessonsIdsByUserEmail(email);
  }

  @Transactional
  public ResponseEntity<?> addFinishedLessonByEmail(String email, Long lessonId) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    Optional<Lesson> lessonOptional = lessonRepository.findById(lessonId);

    if (userOptional.isPresent() && lessonOptional.isPresent()) {
      User user = userOptional.get();
      Lesson lesson = lessonOptional.get();

      if (!user.getFinishedLessonsList().contains(lesson)) {
        user.getFinishedLessonsList().add(lesson);
        userRepository.save(user);
      }
      return ResponseEntity.ok("Course added to finished list.");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Course not found.");
    }
  }

  @Transactional
  public ResponseEntity<?> resetUserPassword(ResetPasswordDTO resetPasswordDTO, String email) {
    if (email == null || resetPasswordDTO.getCurrentPassword() == null || resetPasswordDTO.getPassword() == null
        || resetPasswordDTO.getConfirmPassword() == null) {
      return ResponseEntity.badRequest().body("Email, password and confirm password are required");
    }
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    if (!resetPasswordDTO.getPassword().equals(resetPasswordDTO.getConfirmPassword())) {
      return ResponseEntity.badRequest().body("Passwords do not match");
    }

    if (resetPasswordDTO.getPassword().isBlank()) {
      return ResponseEntity.badRequest().body("Password cannot be empty");
    }

    if (resetPasswordDTO.getPassword().length() < 8) {
      return ResponseEntity.badRequest().body("Password must be at least 8 characters long");
    }
    User user = userOptional.get();

    if (!bCryptPasswordEncoder.matches(resetPasswordDTO.getCurrentPassword(), user.getPassword())) {
      return ResponseEntity.badRequest().body("Current password is incorrect");
    }

    user.setPassword(bCryptPasswordEncoder.encode(resetPasswordDTO.getPassword()));
    return ResponseEntity.ok().body("Password reset successfully");
  }
}
