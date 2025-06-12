package com.project.course.controllers;

import com.project.course.dto.SectorDTO;
import com.project.course.services.SectorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sector")
public class SectorController {
  private final SectorService sectorService;

  public SectorController(SectorService sectorService) {
    this.sectorService = sectorService;
  }

  @GetMapping("/{lessonId}")
  public List<?> getSectorsByLessonId(@PathVariable Long lessonId) {
    return sectorService.findLessonsById(lessonId);
  }

  @PostMapping("/add")
  public ResponseEntity<?> addSector(@RequestBody SectorDTO sectorDTO) {return sectorService.addSector(sectorDTO);}
}
