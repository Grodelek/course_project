package com.project.course.repositories;

import com.project.course.models.Course;
import com.project.course.models.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {
    public List<Sector> findByLessonId(Long lessonId);
}
