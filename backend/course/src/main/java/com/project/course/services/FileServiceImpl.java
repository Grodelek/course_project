package com.project.course.services;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.project.course.dto.FileUploadDTO;
import com.project.course.exceptions.FileUploadException;

import jakarta.annotation.PostConstruct;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.slf4j.Logger;

@Service
public class FileServiceImpl implements FileService {
  private static final Logger log = LoggerFactory.getLogger(FileServiceImpl.class);

  @Value("${aws.s3.bucketName}")
  private String bucketName;
  @Value("${aws.s3.accessKey}")
  private String accessKey;
  @Value("${aws.s3.secretKey}")
  private String secretKey;

  private AmazonS3 s3Client;

  @PostConstruct
  private void initialize() {
    BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
    s3Client = AmazonS3ClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
        .withRegion(Regions.EU_NORTH_1)
        .build();
  }

  @Override
  public FileUploadDTO uploadFile(MultipartFile multipartFile) {
    FileUploadDTO fileUploadResponse = new FileUploadDTO();
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    String todayDate = dateTimeFormatter.format(LocalDate.now());
    String filePath = "";
    try {
      ObjectMetadata objectMetadata = new ObjectMetadata();
      objectMetadata.setContentType(multipartFile.getContentType());
      objectMetadata.setContentLength(multipartFile.getSize());
      filePath = todayDate + "/" + multipartFile.getOriginalFilename();
      s3Client.putObject(bucketName, filePath, multipartFile.getInputStream(), objectMetadata);
      fileUploadResponse.setFilePath(filePath);
      fileUploadResponse.setLocalDateTime(LocalDateTime.now());
    } catch (IOException e) {
      log.error("error occured ==> {}", e.getMessage());
      throw new FileUploadException("Error occurred in file upload ==> " + e.getMessage());
    }
    return fileUploadResponse;
  }
}
