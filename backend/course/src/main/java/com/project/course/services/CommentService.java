package com.project.course.services;

import com.project.course.dto.CommentDTO;
import com.project.course.dto.LessonDTO;
import com.project.course.models.Comment;
import com.project.course.models.Course;
import com.project.course.models.Lesson;
import com.project.course.models.User;
import com.project.course.repositories.CommentRepository;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, CourseRepository courseRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public List<Comment> GetCommentsByCourseId(Long courseId){
        return commentRepository.findByCourseId(courseId);
    }

    @Transactional
    public ResponseEntity<?> addCommentToCourse(@RequestBody CommentDTO commentDTO) {
        if (commentDTO.getContents().isEmpty() || commentDTO.getContents() == null) {
            return ResponseEntity.badRequest().body("Comment contents is empty");
        }
        if(commentDTO.getUser_email() == null){
            return ResponseEntity.badRequest().body("Comment author is empty");
        }
        if(commentDTO.getCourse_id() == null){
            return ResponseEntity.badRequest().body("Comment course is empty");
        }
        Comment comment = new Comment();
        comment.setContents(commentDTO.getContents());
        Optional<Course> courseOpt = courseRepository.findById(commentDTO.getCourse_id());
        if (!courseOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found with ID " + commentDTO.getCourse_id());
        }
        Optional<User> userOpt = userRepository.findByEmail(commentDTO.getUser_email());
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID " + commentDTO.getUser_email());
        }
        Course course = courseOpt.get();
        comment.setCourse(course);
        User user = userOpt.get();
        comment.setUser(user);
        comment.setCreate_date(new Date());
        Optional<Comment> existingCommentOpt = commentRepository.findByUserIdAndCourseId(user.getId(), course.getId());

        if (existingCommentOpt.isPresent()){
            comment = existingCommentOpt.get();
            comment.setContents(commentDTO.getContents());
            comment.setCreate_date(new Date());
            commentRepository.save(comment);
            return ResponseEntity.status(HttpStatus.OK).body("Comment updated!");
        }
        else{
            commentRepository.save(comment);
            return ResponseEntity.status(HttpStatus.OK).body("Comment added!");
        }

    }
}
