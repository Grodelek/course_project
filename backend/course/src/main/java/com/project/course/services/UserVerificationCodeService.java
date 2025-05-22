package com.project.course.services;

import org.springframework.stereotype.Service;
import com.project.course.models.UserVerification;
import com.project.course.repositories.UserVerificationCodeRepository;

@Service
public class UserVerificationCodeService {
  private final UserVerificationCodeRepository userVerificationCodeRepository;

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
