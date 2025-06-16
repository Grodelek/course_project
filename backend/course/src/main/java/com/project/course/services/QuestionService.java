package com.project.course.services;

import com.project.course.dto.LessonDTO;
import com.project.course.dto.QuestionDTO;
import com.project.course.models.*;
import com.project.course.repositories.LessonRepository;
import com.project.course.repositories.QuestionRepository;
import com.project.course.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public QuestionService(QuestionRepository questionRepository, UserRepository userRepository, LessonRepository lessonRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    public List<Question> findBtLessonId(Long lessonId) {
        return questionRepository.findByLessonId(lessonId);
    }

    public void LessonComplete(long userId, long lessonID){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Lesson lesson = lessonRepository.findById(lessonID)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        if (!user.getFinishedLessonsList().contains(lesson)) {
            user.getFinishedLessonsList().add(lesson);
            userRepository.save(user);  // zapisuje relację w tabeli pośredniej
        }
    }

    @Transactional
    public ResponseEntity<?> addQuestionToLesson(@RequestBody QuestionDTO questionDTO) {
        if (questionDTO.getContents().isEmpty() || questionDTO.getContents() == null) {
            return ResponseEntity.badRequest().body("Question is empty");
        }
        Question question = new Question();
        question.setContents(questionDTO.getContents());
        Optional<Lesson> lessonOptional = lessonRepository.findById(questionDTO.getLessonId());
        if (!lessonOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found with ID " + questionDTO.getLessonId());
        }
        Lesson lesson = lessonOptional.get();
        question.setLesson(lesson);
        lesson.getQuestions().add(question);

        Question savedQuestion = questionRepository.save(question);
        lessonRepository.save(lesson);
        return ResponseEntity.status(HttpStatus.OK).body(savedQuestion.getId());
    }
}
