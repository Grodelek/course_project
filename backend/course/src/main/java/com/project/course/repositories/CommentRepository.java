package com.project.course.repositories;

import com.project.course.models.Comment;
import com.project.course.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    public List<Comment> findByCourseId(Long courseId);
}
