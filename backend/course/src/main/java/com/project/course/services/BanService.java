package com.project.course.services;

import com.project.course.models.Ban;
import com.project.course.repositories.BanRepository;
import com.project.course.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BanService {
  private final BanRepository banRepository;
  private final UserRepository userRepository;

  @Autowired
  public BanService(BanRepository banRepository, UserRepository userRepository) {
    this.banRepository = banRepository;
    this.userRepository = userRepository;
  }
  @Transactional
  public ResponseEntity<?> giveBan(Ban ban){
    if(userRepository.existsByEmail(ban.getEmail())) {

      banRepository.save(ban);
      return ResponseEntity.status(HttpStatus.CREATED).body(ban);
    }
    else{
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not existing");
    }

   }
}
