package com.project.course.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import com.project.course.dto.ResetPasswordDTO;
import com.project.course.dto.UserDTO;
import com.project.course.dto.VerificationCodeDTO;
import com.project.course.models.User;
import com.project.course.services.UserService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
    return userService.verify(userDTO);
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody @Valid UserDTO userDTO) {
    return userService.register(userDTO);
  }

  @PutMapping("/user/update/{id}")
  public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO, @PathVariable Long id) {
    return userService.updateUser(userDTO, id);
  }

  @DeleteMapping("/user/delete/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    return userService.deleteUser(id);
  }

  @PostMapping("/authenticate")
  public ResponseEntity<?> authenticate(@RequestBody VerificationCodeDTO verificationCode, @RequestParam String email) {
    return userService.authenticate(verificationCode, email);
  }

  @GetMapping("/user/username")
  public ResponseEntity<?> getUserName(@RequestParam String email) {
    Optional<User> userOpt = userService.findByEmail(email);
    return userOpt.map((User user) -> {
      Map<String, String> response = new HashMap<>();
      response.put("username", user.getUsername());
      response.put("photoPath", user.getPhotoPath());
      return ResponseEntity.ok(response);
    }).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/{email}/finished-courses/{courseId}")
  public ResponseEntity<?> addFinishedCourseByEmail(
      @PathVariable String email,
      @PathVariable Long courseId) {
    return userService.addFinishedCourseByEmail(email, courseId);
  }

  @PostMapping("/{email}/finished-lessons/{lessonId}")
  public ResponseEntity<?> addFinishedLessonByEmail(
      @PathVariable String email,
      @PathVariable Long lessonId) {
    return userService.addFinishedLessonByEmail(email, lessonId);
  }

  @GetMapping("/{email}/finished-course-ids")
  public ResponseEntity<List<Long>> getFinishedCourseIds(@PathVariable String email) {
    List<Long> courseIds = userService.getFinishedCourseIdsByEmail(email);
    return ResponseEntity.ok(courseIds);
  }

  @GetMapping("/{email}/finished-lessons-ids")
  public ResponseEntity<List<Long>> getFinishedLessonsIds(@PathVariable String email) {
    List<Long> lessonsIds = userService.getFinishedLessonsIdsByEmail(email);
    return ResponseEntity.ok(lessonsIds);
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetUserPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO,
      @RequestParam String email) {
    return userService.resetUserPassword(resetPasswordDTO, email);
  }
}
