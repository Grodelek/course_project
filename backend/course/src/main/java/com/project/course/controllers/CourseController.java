package com.project.course.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.project.course.dto.CourseDTO;
import com.project.course.dto.LessonDTO;
import com.project.course.services.CourseService;
import com.project.course.services.LessonService;

@RestController
@RequestMapping("/course")
public class CourseController {
  private CourseService courseService;
  private LessonService lessonService;

  public CourseController(CourseService courseService, LessonService lessonService) {
    this.courseService = courseService;
    this.lessonService = lessonService;
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

  @GetMapping("/{id}/lessons")
  public List<?> getLessonsFromCourse(@PathVariable Long id) {
    return courseService.findLessonsById(id);
  }

  @PostMapping("/{id}/lessons")
  public ResponseEntity<?> addLessonToCourse(@RequestBody LessonDTO lessonDTO, @PathVariable Long id) {
    return lessonService.addLessonToCourse(lessonDTO, id);
  }

  @DeleteMapping("/{courseId}/lessons/{lessonId}")
  public ResponseEntity<?> deleteLesson(@PathVariable Long courseId, @PathVariable Long lessonId) {
    return lessonService.deleteLesson(courseId, lessonId);
  }
}
