package com.project.course.controllers;

import java.util.List;

import com.project.course.models.Lesson;
import com.project.course.services.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

}
