package com.project.course.controllers;

import com.project.course.dto.QuestionDTO;
import com.project.course.models.Lesson;
import com.project.course.services.LessonService;
import com.project.course.services.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/question")
public class QuestionController {
  private QuestionService questionService;
  private LessonService lessonService;

  public QuestionController(QuestionService questionService, LessonService lessonService) {
    this.questionService = questionService;
    this.lessonService = lessonService;
  }

  @GetMapping("/{lessonId}")
  public List<?> getQuestionsByLessonId(@PathVariable Long lessonId) {
    return questionService.findBtLessonId(lessonId);
  }

  @GetMapping("/lesson/{lessonId}")
  public Optional<Lesson> getLessonById(@PathVariable Long lessonId) {
    return lessonService.findById(lessonId);
  }

  @PostMapping("/add")
  public ResponseEntity<?> addLesson(@RequestBody QuestionDTO questionDTO){ return questionService.addQuestionToLesson(questionDTO);}
}
