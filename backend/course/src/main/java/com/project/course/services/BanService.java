package com.project.course.services;

import com.project.course.dto.BanDTO;
import com.project.course.models.Ban;
import com.project.course.models.User;
import com.project.course.repositories.BanRepository;
import com.project.course.repositories.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BanService {
  private final BanRepository banRepository;
  private final UserRepository userRepository;

  public BanService(BanRepository banRepository, UserRepository userRepository) {
    this.banRepository = banRepository;
    this.userRepository = userRepository;
  }

  @Transactional
  public ResponseEntity<?> giveBan(BanDTO banDTO, String email) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not existing");
    }
    User user = userOptional.get();
    user.setRoles("BANNED");
    Ban ban = new Ban();
    ban.setDateStart(LocalDate.now());
    ban.setDateEnd(banDTO.getDateEnd());
    ban.setReason(banDTO.getReason());
    ban.setEmail(user.getEmail());
    banRepository.save(ban);
    return ResponseEntity.status(HttpStatus.CREATED).body(ban);
  }

  @Transactional
  public ResponseEntity<?> unbanUser(String email) {
    Optional<User> userOptional = userRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not existing");
    }
    User user = userOptional.get();
    user.setRoles("USER");
    List<Ban> banList = banRepository.findBanListByEmail(email);
    banRepository.deleteAll(banList);
    return ResponseEntity.ok("User unbanned successfully");
  }
}
