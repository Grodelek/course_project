package com.project.course.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

  @GetMapping("/")
  public ResponseEntity<String> getMessage() {
    return ResponseEntity.ok("Hello world!");
  }

}
