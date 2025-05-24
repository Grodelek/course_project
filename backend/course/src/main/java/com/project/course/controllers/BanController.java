package com.project.course.controllers;

import com.project.course.dto.BanDTO;
import com.project.course.services.BanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class BanController {
  private final BanService banService;

  public BanController(BanService banService) {
    this.banService = banService;
  }

  @PostMapping("/ban")
  public ResponseEntity<?> ban(@Valid @RequestBody BanDTO banDTO, @RequestParam String email) {
    return banService.giveBan(banDTO, email);
  }

  @PostMapping("/unban")
  public ResponseEntity<?> unban(@RequestParam String email) {
    return banService.unbanUser(email);
  }
}
