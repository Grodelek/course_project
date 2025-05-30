package com.project.course.dto;

import jakarta.validation.constraints.NotBlank;

public class ChangeEmailDTO {
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    @NotBlank(message = "New email is required")
    private String newEmail;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }
}
