package com.project.course.services;

import org.springframework.web.multipart.MultipartFile;
import com.project.course.dto.FileUploadDTO;
import com.project.course.models.User;

public interface FileService {
  FileUploadDTO uploadFile(MultipartFile multipartFile, String email);
}
