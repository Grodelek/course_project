package com.project.course.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_verification")
public class UserVerification {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  private Long id;
  @Column(name = "email")
  private String email;
  @Column(name = "verification_code")
  private String verificationCode;

  public UserVerification() {
  }

  public UserVerification(String email, String verificationCode) {
    this.email = email;
    this.verificationCode = verificationCode;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getEmail() {
    return this.email;
  }

  public void setVerificationCode(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  public String getVerificationCode() {
    return this.verificationCode;
  }
}
