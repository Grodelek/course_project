package com.project.course.services;

import com.project.course.models.Comment;
import com.project.course.repositories.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> GetCommentsByCourseId(Long courseId){
        return commentRepository.findByCourseId(courseId);
    }
}
