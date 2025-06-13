package com.project.course.controllers;

import java.util.List;

import com.project.course.dto.LessonDTO;
import com.project.course.models.Lesson;
import com.project.course.services.LessonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.course.dto.RoadmapDTO;
import com.project.course.models.Roadmap;
import com.project.course.services.RoadmapService;

@RestController
@RequestMapping("/lesson")
public class LessonController {
    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/all")
    public List<Lesson> getRoadmapList() {
        return lessonService.getAllLessons();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addLesson(@Valid @RequestBody LessonDTO lessonDTO, @RequestParam Long courseId){
        return lessonService.addLessonToCourse(lessonDTO, courseId);
    }

    @GetMapping("/getWithoutQuiz")
    public List<Lesson> getWithoutQuiz() {return lessonService.getWithoutQuiz();}
}
