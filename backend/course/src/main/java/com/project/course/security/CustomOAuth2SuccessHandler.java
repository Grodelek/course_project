package com.project.course.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import com.project.course.models.User;
import com.project.course.services.UserService;

import org.hibernate.id.uuid.UuidValueGenerator;
import org.springframework.security.core.Authentication;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final UserService userService;
  private final PasswordEncoder passwordEncoder;

  public CustomOAuth2SuccessHandler(UserService userService, PasswordEncoder passwordEncoder) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {
    OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
    String email = token.getPrincipal().getAttribute("email");
    String name = token.getPrincipal().getAttribute("name");

    User user = new User();
    user.setUsername(name);
    user.setEmail(email);
    user.setRoles("USER");
    user.setIsConfirmed('1');
    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
    userService.save(user);
    response.sendRedirect("/oauth2/reset-password");
  }
}
