package com.project.course.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.course.models.UserVerification;

@Repository
public interface UserVerificationCodeRepository extends JpaRepository<UserVerification, Long> {
  UserVerification findByEmail(String email);
}
