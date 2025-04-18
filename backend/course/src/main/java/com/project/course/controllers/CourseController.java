package com.project.course.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.models.CourseDTO;
import com.project.course.services.CourseService;

@RestController
@RequestMapping("/course")
public class CourseController {
  private CourseService courseService;

  @Autowired
  public CourseController(CourseService courseService) {
    this.courseService = courseService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getCourseById(@PathVariable Long id) {
    return courseService.getCourseById(id);
  }

  @GetMapping("/all")
  public List<?> getCourses() {
    return courseService.getCourses();
  }

  @PostMapping("/add")
  public ResponseEntity<?> addCourse(@RequestBody CourseDTO courseDTO) {
    return courseService.addCourse(courseDTO);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateCourse(@RequestBody CourseDTO courseDTO, @PathVariable Long id) {
    return courseService.updateCourse(courseDTO, id);
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
    return courseService.deleteCourse(id);
  }
}
