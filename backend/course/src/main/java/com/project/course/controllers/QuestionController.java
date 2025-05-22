package com.project.course.controllers;

import com.project.course.models.Lesson;
import com.project.course.services.LessonService;
import com.project.course.services.QuestionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
