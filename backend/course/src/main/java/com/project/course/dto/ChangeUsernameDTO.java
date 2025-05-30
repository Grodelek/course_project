package com.project.course.dto;

import jakarta.validation.constraints.NotBlank;

public class ChangeUsernameDTO {
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    @NotBlank(message = "New username is required")
    private String newUsername;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(String newUsername) {
        this.newUsername = newUsername;
    }
}
