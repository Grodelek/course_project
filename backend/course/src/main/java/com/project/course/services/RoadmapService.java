package com.project.course.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.course.models.Roadmap;
import com.project.course.repositories.RoadmapRepository;

@Service
public class RoadmapService {
  private final RoadmapRepository roadmapRepository;

  public RoadmapService(RoadmapRepository roadmapRepository) {
    this.roadmapRepository = roadmapRepository;
  }

  public List<Roadmap> getRoadmapList() {
    return roadmapRepository.findAll();
  }
}
