package com.project.course.services;

import com.project.course.models.Lesson;
import com.project.course.models.Question;
import com.project.course.models.Sector;
import com.project.course.models.User;
import com.project.course.repositories.LessonRepository;
import com.project.course.repositories.QuestionRepository;
import com.project.course.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
