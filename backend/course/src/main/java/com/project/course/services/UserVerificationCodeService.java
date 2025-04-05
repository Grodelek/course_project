package com.project.course.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.project.course.models.UserVerification;
import com.project.course.repositories.UserVerificationCodeRepository;

@Service
public class UserVerificationCodeService {
  private final UserVerificationCodeRepository userVerificationCodeRepository;

  @Autowired
  public UserVerificationCodeService(UserVerificationCodeRepository userVerificationCodeRepository) {
    this.userVerificationCodeRepository = userVerificationCodeRepository;
  }

  public void save(UserVerification userVerification) {
    userVerificationCodeRepository.save(userVerification);
  }

  public UserVerification findByEmail(String email) {
    return userVerificationCodeRepository.findByEmail(email);
  }
}
