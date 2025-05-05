package com.project.course.dto;

import java.time.LocalDateTime;

public class FileUploadDTO {
  private String filePath;
  private LocalDateTime dateTime;

  public void setFilePath(String filePath) {
    this.filePath = filePath;
  }

  public String getFilePath() {
    return filePath;
  }

  public LocalDateTime getLocalDateTime() {
    return dateTime;
  }

  public void setLocalDateTime(LocalDateTime localDateTime) {
    this.dateTime = localDateTime;
  }
}
