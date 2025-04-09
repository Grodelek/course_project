package com.project.course.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
