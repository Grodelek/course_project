package com.project.course.controllers;


import com.project.course.dto.AnswerDTO;
import com.project.course.services.AnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/answer")
public class AnswerController {
    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAnswerToQuestion(@RequestBody AnswerDTO answerDTO) {return answerService.addAnswerToQuestion(answerDTO);}
}
