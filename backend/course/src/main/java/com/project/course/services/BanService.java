package com.project.course.services;

import com.project.course.models.User;
import com.project.course.repositories.BanRepository;
import com.project.course.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BanService {
  private final BanRepository banRepository;
  private final UserRepository userRepository;

  @Autowired
  public BanService(BanRepository banRepository, UserRepository userRepository) {
    this.banRepository = banRepository;
    this.userRepository = userRepository;
  }
  /*
   * public ResponseEntity<?> giveBan(User user){
   * Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
   * if(optionalUser.isPresent()){
   * user = optionalUser.get();;
   * }
   * }
   */
}
