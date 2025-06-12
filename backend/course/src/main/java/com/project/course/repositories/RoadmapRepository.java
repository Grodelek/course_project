package com.project.course.repositories;

import com.project.course.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.course.models.Roadmap;

import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    public Optional<Roadmap> findById(Long id);
}
