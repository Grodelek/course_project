package com.project.course.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.models.User;
import com.project.course.services.UserService;
import com.project.course.models.UserDTO;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
    return userService.authenticate(userDTO);
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody UserDTO userForm) {
    try {
      User registeredUser = userService.register(userForm);
      return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
  }
}
