package com.project.course.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.course.models.Roadmap;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

}
