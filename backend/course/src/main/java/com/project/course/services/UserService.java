package com.project.course.services;

import com.project.course.models.User;
import com.project.course.models.UserDTO;
import com.project.course.repositories.UserRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JWTService jwtService;

  @Autowired
  public UserService(UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JWTService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  public User register(User user) {
    userRepository.save(user);
    return user;
  }

  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public void save(User user) {
    userRepository.save(user);
  }

  public ResponseEntity<String> verify(User user) {
    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
    Optional<User> userOptional = findByEmail(user.getEmail());
    if (userOptional.isPresent()) {
      User presentUser = userOptional.get();
      if (presentUser.getIsConfirmed() == '1') {
        if (authentication.isAuthenticated()) {
          return ResponseEntity.ok(jwtService.generateToken(user.getEmail()));
        } else {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
        }
      } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not confirmed");
      }
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
  }
}
