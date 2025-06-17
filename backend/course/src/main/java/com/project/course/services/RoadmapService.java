package com.project.course.services;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.project.course.dto.RoadmapDTO;
import com.project.course.models.Course;
import com.project.course.models.Roadmap;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.RoadmapRepository;

@Service
public class RoadmapService {
  private final RoadmapRepository roadmapRepository;
  private final CourseRepository courseRepository;

  public RoadmapService(RoadmapRepository roadmapRepository, CourseRepository courseRepository) {
    this.roadmapRepository = roadmapRepository;
    this.courseRepository = courseRepository;
  }

  @Transactional
  public ResponseEntity<?> updateRoadmap(@RequestBody RoadmapDTO roadmapDTO, @PathVariable Long roadmapId) {
    if (roadmapDTO.getName() == null || roadmapDTO.getName().isBlank()) {
      return ResponseEntity.badRequest().body("Roadmap name is required");
    }

    Optional<Roadmap> roadmapOptional = roadmapRepository.findById(roadmapId);
    if (!roadmapOptional.isPresent()) {
      return ResponseEntity.status(404).body("Roadmap not found with ID " + roadmapId);
    }

    Roadmap roadmap = roadmapOptional.get();
    roadmap.setName(roadmapDTO.getName());

    roadmapRepository.save(roadmap);
    return ResponseEntity.ok("Roadmap updated successfully");
  }


  @Transactional
  public ResponseEntity<?> deleteRoadmap(@PathVariable Long roadmapId) {
    Optional<Roadmap> roadmapOptional = roadmapRepository.findById(roadmapId);
    if (!roadmapOptional.isPresent()) {
      return ResponseEntity.status(404).body("Roadmap not found with ID " + roadmapId);
    }

    Roadmap roadmap = roadmapOptional.get();
    // Clear course associations
    List<Course> courses = roadmap.getCourseList();
    for (Course course : courses) {
      course.setRoadmap(null);
    }
    courseRepository.saveAll(courses);

    roadmapRepository.delete(roadmap);
    return ResponseEntity.ok("Roadmap deleted successfully");
  }

  public List<Roadmap> getRoadmapList() {
    return roadmapRepository.findAll();
  }

  @Transactional
  public ResponseEntity<?> addRoadmap(@RequestBody RoadmapDTO roadmapDTO) {
    if (roadmapDTO.getName() == null || roadmapDTO.getName().isBlank()) {
      return ResponseEntity.badRequest().body("Roadmap name is required");
    }
    List<Long> courseIds = roadmapDTO.getCourseIds();
    if (courseIds == null || courseIds.isEmpty()) {
      return ResponseEntity.badRequest().body("Course list cannot be empty.");
    }

    Roadmap roadmap = new Roadmap();
    roadmap.setName(roadmapDTO.getName());
    List<Course> courseList = courseRepository.findAllById(courseIds);
    for (Course course : courseList) {
      course.setRoadmap(roadmap);
    }
    roadmap.setCourseList(courseList);
    roadmapRepository.save(roadmap);
    courseRepository.saveAll(courseList);
    updateRating(roadmap.getId());

    return ResponseEntity.ok("Roadmap added successfully");
  }

  public void updateRating(Long id) {
    Optional<Roadmap> roadmapOptional = roadmapRepository.findById(id);
    if (!roadmapOptional.isPresent()) {
      return;
    }
    Roadmap roadmap = roadmapOptional.get();
    List<Course> courses = roadmap.getCourseList();
    int rating = 0;
    for (Course course : courses) {
      rating += course.getRating();
    }
    rating = courses.isEmpty() ? 0 : rating / courses.size();

    roadmap.setRating(rating);
    roadmapRepository.save(roadmap);
  }
}