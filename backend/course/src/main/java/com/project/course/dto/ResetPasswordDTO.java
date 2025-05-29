package com.project.course.dto;

import jakarta.validation.constraints.NotBlank;

public class ResetPasswordDTO {

  @NotBlank(message = "Current password is required")
  private String currentPassword;
  @NotBlank(message = "Password is required")
  private String password;
  @NotBlank(message = "Confirm password is required")
  private String confirmPassword;

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getConfirmPassword() {
    return confirmPassword;
  }

  public void setConfirmPassword(String confirmPassword) {
    this.confirmPassword = confirmPassword;
  }

  public String getCurrentPassword() {
    return currentPassword;
  }

  public void setCurrentPassword(String currentPassword) {
    this.currentPassword = currentPassword;
  }

}
