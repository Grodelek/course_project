package com.project.course.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import com.project.course.models.Course;
import com.project.course.models.CourseDTO;
import com.project.course.models.Lesson;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.LessonRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@Service
public class CourseService {
  private final CourseRepository courseRepository;
  private final LessonRepository lessonRepository;

  public CourseService(CourseRepository courseRepository, LessonRepository lessonRepository) {
    this.courseRepository = courseRepository;
    this.lessonRepository = lessonRepository;
  }

  public List<Course> getCourses() {
    return courseRepository.findAll();
  }

  public ResponseEntity<?> getCourseById(@PathVariable Long id) {
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (courseOptional.isPresent()) {
      Course course = courseOptional.get();
      return ResponseEntity.status(HttpStatus.ACCEPTED).body(course);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
  }

  @Transactional
  public ResponseEntity<?> addCourse(@RequestBody CourseDTO courseDTO) {
    if (courseDTO.getName() == null || courseDTO.getName().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Course name must not be empty");
    }
    Optional<Course> courseOptional = courseRepository.findByName(courseDTO.getName());
    if (courseOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Course already existing");
    }
    Course course = new Course();
    course.setName(courseDTO.getName());
    course.setDescription(courseDTO.getDescription());
    course.setLength(courseDTO.getLength());
    course.setRating(5);
    courseRepository.save(course);
    return ResponseEntity.status(HttpStatus.CREATED).body("Course added!");
  }

  @Transactional
  public ResponseEntity<?> updateCourse(@RequestBody CourseDTO courseDTO, @PathVariable Long id) {
    if (courseDTO.getName() == null || courseDTO.getName().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Course name must not be empty");
    }
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (courseOptional.isPresent()) {
      Course course = courseOptional.get();
      course.setName(courseDTO.getName());
      course.setDescription(courseDTO.getDescription());
      course.setLength(courseDTO.getLength());
      courseRepository.save(course);
      return ResponseEntity.ok(course);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
    }
  }

  @Transactional
  public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (courseOptional.isPresent()) {
      Course course = courseOptional.get();
      courseRepository.delete(course);
      return ResponseEntity.status(HttpStatus.OK).body("course with id: " + id + " deleted successfully");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
    }
  }

  public List<Lesson> findLessonsById(Long id) {
    return lessonRepository.findByCourseId(id);
  }
}
