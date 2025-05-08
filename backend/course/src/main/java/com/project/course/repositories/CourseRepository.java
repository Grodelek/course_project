package com.project.course.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.course.models.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

  public Optional<Course> findByName(String name);

  public List<Course> findByNameIn(List<String> nameList);
}
