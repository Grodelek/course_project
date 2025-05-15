package com.project.course.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.project.course.dto.FileUploadDTO;
import com.project.course.services.FileService;

@RestController
@RequestMapping("/api/s3")
public class FileUploadController {
  @Autowired
  private FileService fileService;

  @PostMapping("/upload")
  public ResponseEntity<FileUploadDTO> uploadFile(@RequestParam("file") MultipartFile file,
      @RequestParam("email") String email) {
    return new ResponseEntity<>(fileService.uploadFile(file, email), HttpStatus.OK);
  }
}
