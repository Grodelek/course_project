package com.project.course.services;

import com.project.course.models.User;
import com.project.course.models.UserDTO;
import com.project.course.repositories.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public ResponseEntity<?> authenticate(UserDTO userForm) {
    Optional<User> optionalUser = userRepository.findByEmail(userForm.getEmail());
    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
    User user = optionalUser.get();
    if (!passwordEncoder.matches(userForm.getPassword(), user.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
    return ResponseEntity.ok("Login successful");
  }

  public User register(UserDTO userForm) {
    if (userForm.getEmail().isEmpty()) {
      throw new IllegalStateException("Email cannot be empty!");
    }
    User user = new User();
    user.setEmail(userForm.getEmail());
    user.setPassword(passwordEncoder.encode(userForm.getPassword())); // Hashowanie hasła
    user.setIsConfirmed('0');
    user.setRoles("USER");
    return userRepository.save(user);
  }
}
