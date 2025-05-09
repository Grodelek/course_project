package com.project.course.services;


import com.project.course.models.Course;
import com.project.course.models.Lesson;
import com.project.course.models.Sector;
import com.project.course.repositories.SectorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
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
