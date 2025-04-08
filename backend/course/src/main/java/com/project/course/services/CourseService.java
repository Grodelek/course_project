package com.project.course.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.project.course.models.Course;
import com.project.course.repositories.CourseRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@Service
public class CourseService {
  private final CourseRepository courseRepository;

  public CourseService(CourseRepository courseRepository) {
    this.courseRepository = courseRepository;
  }

  public List<Course> getCourses() {
    return courseRepository.findAll();
  }

  @Transactional
  public ResponseEntity<?> addCourse(@RequestBody Course courseForm) {
    if (courseForm.getName() == null || courseForm.getName().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Course name must not be empty");
    }
    Optional<Course> courseOptional = courseRepository.findByName(courseForm.getName());
    if (courseOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Course already existing");
    }
    Course course = new Course();
    course.setName(courseForm.getName());
    courseRepository.save(course);
    return ResponseEntity.status(HttpStatus.CREATED).body("Course added!");
  }

  @Transactional
  public ResponseEntity<?> updateCourse(@RequestBody Course courseForm, @PathVariable Long id) {
    if (courseForm.getName() == null || courseForm.getName().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Course name must not be empty");
    }
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (courseOptional.isPresent()) {
      Course course = courseOptional.get();
      course.setName(courseForm.getName());
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
}
