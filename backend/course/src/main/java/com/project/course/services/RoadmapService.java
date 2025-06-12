package com.project.course.services;

import java.util.List;
import java.util.Optional;

import com.project.course.models.Comment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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

  public List<Roadmap> getRoadmapList() {
    return roadmapRepository.findAll();
  }

  public ResponseEntity<?> addRoadmap(RoadmapDTO roadmapDTO) {
    if (roadmapDTO.getName() == null || roadmapDTO.getName().isBlank()) {
      return ResponseEntity.badRequest().body("Roadmap name is required");
    }
    List<String> courseTitles = roadmapDTO.getCourseTitles();
    if (courseTitles == null || courseTitles.isEmpty()) {
      return ResponseEntity.badRequest().body("Course list cannot be empty.");
    }
    Roadmap roadmap = new Roadmap();
    roadmap.setName(roadmapDTO.getName());
    List<Course> courseList = courseRepository.findByNameIn(courseTitles);
    for (Course course : courseList) {
      course.setRoadmap(roadmap);
    }
    roadmap.setCourseList(courseList);
    roadmapRepository.save(roadmap);
    return ResponseEntity.ok("Roadmap added successfully");
  }

  public void updateRating(Long id){
    Optional<Roadmap> roadmapOptional = roadmapRepository.findById(id);
    if(!roadmapOptional.isPresent()){
      return;
    }
    Roadmap roadmap = roadmapOptional.get();
    List<Course> courses = roadmap.getCourseList();
    int rating = 0;
    for(Course course : courses){
      rating += course.getRating();
    }
    rating = rating / courses.size();

    roadmap.setRating(rating);
    roadmapRepository.save(roadmap);
  }
}
