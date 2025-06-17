package com.project.course.services;

import com.project.course.dto.*;
import com.project.course.exceptions.UserAlreadyExistsException;
import com.project.course.models.*;
import com.project.course.repositories.*;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.*;
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
  private final CourseService courseService;
  private final RoadmapRepository roadmapRepository;

  public UserService(UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JWTService jwtService,
      UserVerificationCodeService userVerificationCodeService,
      EmailSenderService emailSenderService,
      BanRepository banRepository,
      LessonRepository lessonRepository,
      CourseService courseService,
      CourseRepository courseRepository,
      RoadmapRepository roadmapRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userVerificationCodeService = userVerificationCodeService;
    this.emailSenderService = emailSenderService;
    this.banRepository = banRepository;
    this.lessonRepository = lessonRepository;
    this.courseService = courseService;
    this.courseRepository = courseRepository;
    this.roadmapRepository = roadmapRepository;
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

      isRoadmapFinished(email, course.getRoadmap().getId());
      return ResponseEntity.ok("Course added to finished list.");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Course not found.");
    }
  }

  @Transactional
  public ResponseEntity<?> addFinishedRoadmapByEmail(String email, Long roadmapId) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    Optional<Roadmap> roadmapOptional = roadmapRepository.findById(roadmapId);

    if (userOptional.isPresent() && roadmapOptional.isPresent()) {
      User user = userOptional.get();
      Roadmap roadmap = roadmapOptional.get();

      if (!user.getFinishedRoadmapsList().contains(roadmap)) {
        user.getFinishedRoadmapsList().add(roadmap);
        userRepository.save(user);
      }

      return ResponseEntity.ok("Roadmap added to finished list.");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Roadmap not found.");
    }
  }

  public List<Long> getFinishedCourseIdsByEmail(String email) {
    return userRepository.findFinishedCourseIdsByUserEmail(email);
  }

  public List<Long> getFinishedLessonsIdsByEmail(String email) {
    return userRepository.findFinishedLessonsIdsByUserEmail(email);
  }

  public void isRoadmapFinished(String email, Long roadmapId) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (!userOptional.isPresent()) {
      return;
    }

    Optional<Roadmap> roadmapOptional = roadmapRepository.findById(roadmapId);
    if (!roadmapOptional.isPresent()) {
      return;
    }
    Roadmap roadmap = roadmapOptional.get();
    List<Long> finishedCourses = getFinishedCourseIdsByEmail(email);

    int i = 0;
    for (Course course : roadmap.getCourseList()) {
      if (finishedCourses.contains(course.getId())) {
        i++;
      }
    }

    if (roadmap.getCourseList().size() == i) {
      addFinishedRoadmapByEmail(email, roadmap.getId());
    }

  }

  public void isCourseFinished(String email, Long courseId) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (!userOptional.isPresent()) {
      return;
    }

    Optional<Course> courseOptional = courseRepository.findById(courseId);
    if (!courseOptional.isPresent()) {
      return;
    }
    Course course = courseOptional.get();
    List<Long> finishedLessons = getFinishedLessonsIdsByEmail(email);

    int i = 0;
    for (Lesson lesson : course.getLessons()) {
      if (finishedLessons.contains(lesson.getId())) {
        i++;
      }
    }

    if (course.getLessons().size() == i) {
      addFinishedCourseByEmail(email, course.getId());
    }

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
      isCourseFinished(email, lesson.getCourse().getId());
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

  @Transactional
  public ResponseEntity<?> changeUsername(ChangeUsernameDTO changeUsernameDTO, String email) {
    if (email == null || changeUsernameDTO.getNewUsername() == null || changeUsernameDTO.getCurrentPassword() == null) {
      return ResponseEntity.badRequest().body("Email, password and new username are required");
    }
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
    User user = userOptional.get();
    if (!bCryptPasswordEncoder.matches(changeUsernameDTO.getCurrentPassword(), user.getPassword())) {
      return ResponseEntity.badRequest().body("Current password is incorrect");
    }

    user.setUsername(changeUsernameDTO.getNewUsername());

    return ResponseEntity.ok().body("Username changed successfully");
  }

  @Transactional
  public ResponseEntity<?> changeEmail(ChangeEmailDTO changeEmailDTO, String email) {
    if (email == null || changeEmailDTO.getNewEmail() == null || changeEmailDTO.getCurrentPassword() == null) {
      return ResponseEntity.badRequest().body("Email, password and new email are required");
    }
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
    User user = userOptional.get();
    if (!bCryptPasswordEncoder.matches(changeEmailDTO.getCurrentPassword(), user.getPassword())) {
      return ResponseEntity.badRequest().body("Current password is incorrect");
    }

    user.setEmail(changeEmailDTO.getNewEmail());

    return ResponseEntity.ok().body("Email changed successfully");
  }

  public List<CourseProgressDTO> getCoursesPercentage(String email) {
    List<CourseProgressDTO> response = new ArrayList<>();
    Optional<User> userOptional = userRepository.findByEmail(email);

    if (!userOptional.isPresent()) {
      return response;
    }

    User user = userOptional.get();
    List<Course> courses = courseService.getCourses();
    List<Long> finishedLessons = getFinishedLessonsIdsByEmail(email);

    for (Course course : courses) {
      int finished = 0;
      int all = 0;
      for (Lesson lesson : course.getLessons()) {
        all++;
        if (finishedLessons.contains(lesson.getId())) {
          finished++;
        }
      }
      int percentage = (all == 0) ? 0 : (int) ((finished * 100.0) / all);
      if (percentage > 0 && percentage < 100) {
        response.add(new CourseProgressDTO(course.getName(), course.getId(), percentage));
      }
    }

    return response;
  }

  public List<User> findAllUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserByToken(String token) {
    return userRepository.findByAuthToken(token);
  }
}
