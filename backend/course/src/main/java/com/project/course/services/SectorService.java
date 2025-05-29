package com.project.course.services;

import com.project.course.models.Sector;
import com.project.course.repositories.SectorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SectorService {
  private final SectorRepository sectorRepository;

  public SectorService(SectorRepository sectorRepository) {
    this.sectorRepository = sectorRepository;
  }

  public List<Sector> findLessonsById(Long lessonId) {
    return sectorRepository.findByLessonId(lessonId);
  }
}
