package com.project.course.controllers;

import com.project.course.dto.CommentDTO;
import com.project.course.dto.CourseDTO;
import com.project.course.models.Comment;
import com.project.course.services.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {
    private CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public List<Comment> GetCommentsByCourseId(@PathVariable Long id) {
        return commentService.GetCommentsByCourseId(id);
    }
    @PostMapping("/add")
    public ResponseEntity<?> addComment(@RequestBody CommentDTO commentDTO) {
        return commentService.addCommentToCourse(commentDTO);
    }
}
