package com.project.course.services;

import java.util.List;
import java.util.Optional;

import com.project.course.models.Comment;
import com.project.course.repositories.CommentRepository;
import com.project.course.repositories.RoadmapRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import com.project.course.models.Course;
import com.project.course.dto.CourseDTO;
import com.project.course.models.Lesson;
import com.project.course.models.Roadmap;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.LessonRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@Service
public class CourseService {
  private final CourseRepository courseRepository;
  private final LessonRepository lessonRepository;
  private final CommentRepository commentRepository;
  private final RoadmapRepository roadmapRepository;
  private final RoadmapService roadmapService;

  public CourseService(CourseRepository courseRepository, LessonRepository lessonRepository,
                       CommentRepository commentRepository, RoadmapRepository roadmapRepository,
                       RoadmapService roadmapService) {
    this.courseRepository = courseRepository;
    this.lessonRepository = lessonRepository;
    this.commentRepository = commentRepository;
    this.roadmapRepository = roadmapRepository;
    this.roadmapService = roadmapService;
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
    course.setLength(0);
    course.setRating(5);

    if (courseDTO.getRoadmapId() != null) {
      Optional<Roadmap> roadmapOptional = roadmapRepository.findById(courseDTO.getRoadmapId());
      if (!roadmapOptional.isPresent()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Roadmap not found with ID " + courseDTO.getRoadmapId());
      }
      course.setRoadmap(roadmapOptional.get());
    }

    courseRepository.save(course);
    if (course.getRoadmap() != null) {
      roadmapService.updateRating(course.getRoadmap().getId());
    }
    return ResponseEntity.status(HttpStatus.CREATED).body("Course added!");
  }

  @Transactional
  public ResponseEntity<?> updateCourse(@RequestBody CourseDTO courseDTO, @PathVariable Long id) {
    if (courseDTO.getName() == null || courseDTO.getName().trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Course name must not be empty");
    }
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (!courseOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
    }

    Course course = courseOptional.get();
    Long oldRoadmapId = course.getRoadmap() != null ? course.getRoadmap().getId() : null;
    course.setName(courseDTO.getName());
    course.setDescription(courseDTO.getDescription());
    course.setLength(course.getLessons().size());

    // Update roadmap association
    if (courseDTO.getRoadmapId() != null) {
      Optional<Roadmap> roadmapOptional = roadmapRepository.findById(courseDTO.getRoadmapId());
      if (!roadmapOptional.isPresent()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Roadmap not found with ID " + courseDTO.getRoadmapId());
      }
      course.setRoadmap(roadmapOptional.get());
    } else {
      course.setRoadmap(null);
    }

    courseRepository.save(course);
    if (oldRoadmapId != null) {
      roadmapService.updateRating(oldRoadmapId);
    }
    if (course.getRoadmap() != null) {
      roadmapService.updateRating(course.getRoadmap().getId());
    }
    return ResponseEntity.ok(course);
  }

  @Transactional
  public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (!courseOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
    }

    Course course = courseOptional.get();
    Long roadmapId = course.getRoadmap() != null ? course.getRoadmap().getId() : null;
    course.setRoadmap(null); // Clear roadmap association
    courseRepository.save(course);
    courseRepository.delete(course);

    if (roadmapId != null) {
      roadmapService.updateRating(roadmapId);
    }
    return ResponseEntity.status(HttpStatus.OK).body("course with id: " + id + " deleted successfully");
  }

  public List<Lesson> findLessonsById(Long id) {
    return lessonRepository.findByCourseId(id);
  }

  public void updateRating(Long id) {
    Optional<Course> courseOptional = courseRepository.findById(id);
    if (!courseOptional.isPresent()) {
      return;
    }
    Course course = courseOptional.get();
    List<Comment> comments = commentRepository.findByCourseId(id);
    int rating = 0;
    for (Comment comment : comments) {
      rating += comment.getRating();
    }
    rating = comments.isEmpty() ? 5 : rating / comments.size();

    course.setRating(rating);
    courseRepository.save(course);
    if (course.getRoadmap() != null) {
      roadmapService.updateRating(course.getRoadmap().getId());
    }
  }
}