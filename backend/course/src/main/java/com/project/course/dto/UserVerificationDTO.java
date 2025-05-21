package com.project.course.dto;

public class UserVerificationDTO {
  private String verificationCode;

  public UserVerificationDTO() {
  }

  public UserVerificationDTO(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  public void setVerificationCode(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  public String getVerificationCode() {
    return this.verificationCode;
  }
}
