package com.project.course.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.project.course.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUsername(String username);

  public boolean existsByEmail(String email);

  public boolean existsByUsername(String username);

  public Optional<User> findByAuthToken(String token);

  @Query("SELECT c.id FROM User u JOIN u.finishedCoursesList c WHERE u.email = :email")
  List<Long> findFinishedCourseIdsByUserEmail(@Param("email") String email);

  @Query("SELECT l.id FROM User u JOIN u.finishedLessonsList l WHERE u.email = :email")
  List<Long> findFinishedLessonsIdsByUserEmail(@Param("email") String email);

}
