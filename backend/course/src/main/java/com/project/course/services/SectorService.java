package com.project.course.services;

import com.project.course.dto.LessonDTO;
import com.project.course.dto.SectorDTO;
import com.project.course.models.Lesson;
import com.project.course.models.Sector;
import com.project.course.repositories.LessonRepository;
import com.project.course.repositories.SectorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class SectorService {
  private final SectorRepository sectorRepository;
  private final LessonRepository lessonRepository;

  public SectorService(SectorRepository sectorRepository, LessonRepository lessonRepository) {
    this.sectorRepository = sectorRepository;
    this.lessonRepository = lessonRepository;
  }

  public List<Sector> findLessonsById(Long lessonId) {
    return sectorRepository.findByLessonId(lessonId);
  }
  public ResponseEntity<?> addSector(@RequestBody SectorDTO sectorDTO) {
    Optional<Lesson> lessonOpt = lessonRepository.findById(sectorDTO.getLessonId());
    if (lessonOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found");
    }

    Sector sector = new Sector();
    sector.setType(sectorDTO.getType());
    sector.setValue(sectorDTO.getValue());
    sector.setAlternative(sectorDTO.getAlternative());
    sector.setPlace(sectorDTO.getPlace());
    sector.setLesson(lessonOpt.get());

    Sector savedSector = sectorRepository.save(sector);

    return ResponseEntity.status(HttpStatus.OK).body(savedSector.getId());
  }

}
