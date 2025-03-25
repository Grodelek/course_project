package com.project.course.services;

import com.project.course.models.User;
import com.project.course.models.UserPrincipal;
import com.project.course.repositories.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
  private UserRepository userRepository;

  @Autowired
  public MyUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return userRepository.findByEmail(email)
        .map(UserPrincipal::new) // Tworzymy UserPrincipal tylko jeśli użytkownik istnieje
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
