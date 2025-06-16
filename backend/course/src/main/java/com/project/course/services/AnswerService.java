package com.project.course.services;

import com.project.course.dto.AnswerDTO;
import com.project.course.dto.QuestionDTO;
import com.project.course.models.Answer;
import com.project.course.models.Lesson;
import com.project.course.models.Question;
import com.project.course.repositories.AnswerRepository;
import com.project.course.repositories.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional
    public ResponseEntity<?> addAnswerToQuestion(@RequestBody AnswerDTO answerDTO) {
        System.out.println("AnswerDTO: contents=" + answerDTO.getContents() +
                ", isCorrect=" + answerDTO.isCorrect() +
                ", questionId=" + answerDTO.getQuestionId());

        if (answerDTO.getContents().isEmpty() || answerDTO.getContents() == null) {
            return ResponseEntity.badRequest().body("Answer is empty");
        }
        Answer answer = new Answer();
        answer.setContents(answerDTO.getContents());
        answer.setCorrect(answerDTO.isCorrect());
        System.out.println("Answer before save: isCorrect=" + answer.isCorrect());

        Optional<Question> questionOptional = questionRepository.findById(answerDTO.getQuestionId());
        if (!questionOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found with ID " + answerDTO.getQuestionId());
        }
        Question question = questionOptional.get();
        answer.setQuestion(question);
        question.getAnswers().add(answer);

        answerRepository.save(answer);
        questionRepository.save(question);
        return ResponseEntity.status(HttpStatus.OK).body("Answer added");
    }
}
