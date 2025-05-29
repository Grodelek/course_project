package com.project.course.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.course.dto.CourseDTO;
import com.project.course.models.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
  List<Lesson> findLessonsByCourse(CourseDTO courseDTO);

  List<Lesson> findByCourseId(Long courseId);

  Optional<Lesson> findById(Long lessonId);
}
