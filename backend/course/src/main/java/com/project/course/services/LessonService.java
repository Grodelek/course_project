package com.project.course.services;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import com.project.course.models.Course;
import com.project.course.models.Lesson;
import com.project.course.models.LessonDTO;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.LessonRepository;

@Service
public class LessonService {
  private LessonRepository lessonRepository;
  private CourseRepository courseRepository;

  @Autowired
  public LessonService(LessonRepository lessonRepository, CourseRepository courseRepository) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
  }

  @Transactional
  public ResponseEntity<?> addLessonToCourse(@RequestBody LessonDTO lessonDTO, Long id) {
    if (lessonDTO.getName().isEmpty() || lessonDTO.getName() == null) {
      return ResponseEntity.badRequest().body("Lesson name is empty");
    }
    Lesson lesson = new Lesson();
    lesson.setName(lessonDTO.getName());
    lesson.setDescription(lessonDTO.getDescription());
    lesson.setIsFinished(false);
    Optional<Course> courseOpt = courseRepository.findById(id);
    if (!courseOpt.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found with ID " + id);
    }
    Course course = courseOpt.get();
    lesson.setCourse(course);
    course.getLessons().add(lesson);
    lessonRepository.save(lesson);
    courseRepository.save(course);
    return ResponseEntity.status(HttpStatus.OK).body("Lesson added to course " + id);

  }
}
