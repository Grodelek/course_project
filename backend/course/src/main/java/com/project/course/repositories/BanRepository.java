package com.project.course.repositories;

import com.project.course.models.Ban;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BanRepository extends JpaRepository<Ban, Long> {
    Optional<Ban> findByEmail(String email);

    public boolean existsByEmail(String email);
}
