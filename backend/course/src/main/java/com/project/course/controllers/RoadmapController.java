package com.project.course.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.course.dto.RoadmapDTO;
import com.project.course.models.Roadmap;
import com.project.course.services.RoadmapService;

@RestController
@RequestMapping("/roadmap")
public class RoadmapController {
  private RoadmapService roadmapService;

  public RoadmapController(RoadmapService roadmapService) {
    this.roadmapService = roadmapService;
  }

  @GetMapping("/all")
  public List<Roadmap> getRoadmapList() {
    return roadmapService.getRoadmapList();
  }

  @PostMapping("/add")
  public ResponseEntity<?> addRoadmap(@RequestParam String name) {
    return roadmapService.addRoadmap(name);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateRoadmap(@RequestBody RoadmapDTO roadmapDTO, @PathVariable Long id){return roadmapService.updateRoadmap(roadmapDTO,id);}

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteRoadmap(@PathVariable Long id) {return roadmapService.deleteRoadmap(id);}
}
