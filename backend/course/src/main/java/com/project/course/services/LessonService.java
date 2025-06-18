package com.project.course.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.project.course.dto.LessonUpdateDTO;
import com.project.course.models.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.project.course.models.Course;
import com.project.course.models.Lesson;
import com.project.course.dto.LessonDTO;
import com.project.course.repositories.CourseRepository;
import com.project.course.repositories.LessonRepository;

@Service
public class LessonService {
  private LessonRepository lessonRepository;
  private CourseRepository courseRepository;

  @Autowired
  public LessonService(LessonRepository lessonRepository, CourseRepository courseRepository) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
  }

  @Transactional
  public ResponseEntity<?> updateLesson(@RequestBody LessonUpdateDTO lessonDTO, @PathVariable Long lessonId) {
    if (lessonDTO.getName() == null || lessonDTO.getName().isEmpty()) {
      return ResponseEntity.badRequest().body("Lesson name is empty");
    }

    Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
    if (!lessonOpt.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found with ID " + lessonId);
    }

    Optional<Course> courseOpt = courseRepository.findById(lessonDTO.getCourseId());
    if (!courseOpt.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found with ID " + lessonDTO.getCourseId());
    }

    Lesson lesson = lessonOpt.get();
    Course newCourse = courseOpt.get();

    // Update lesson details
    lesson.setName(lessonDTO.getName());
    lesson.setDescription(lessonDTO.getDescription());

    // Update course association if changed
    if (!lesson.getCourse().getId().equals(lessonDTO.getCourseId())) {
      Course oldCourse = lesson.getCourse();
      oldCourse.getLessons().remove(lesson); // Remove lesson from old course
      lesson.setCourse(newCourse); // Set new course
      newCourse.getLessons().add(lesson); // Add lesson to new course
      courseRepository.save(oldCourse); // Save old course to update its lessons
      courseRepository.save(newCourse); // Save new course to update its lessons
    }

    Lesson updatedLesson = lessonRepository.save(lesson);
    return ResponseEntity.status(HttpStatus.OK).body(updatedLesson.getId());
  }

  @Transactional
  public ResponseEntity<?> addLessonToCourse(@RequestBody LessonDTO lessonDTO, Long id) {
    if (lessonDTO.getName().isEmpty() || lessonDTO.getName() == null) {
      return ResponseEntity.badRequest().body("Lesson name is empty");
    }
    Lesson lesson = new Lesson();
    lesson.setName(lessonDTO.getName());
    lesson.setDescription(lessonDTO.getDescription());
    lesson.setIsFinished(false);
    Optional<Course> courseOpt = courseRepository.findById(id);
    if (!courseOpt.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found with ID " + id);
    }
    Course course = courseOpt.get();
    lesson.setCourse(course);
    course.getLessons().add(lesson);
    course.setLength(course.getLessons().size());
    Lesson lessonSaved = lessonRepository.save(lesson);
    courseRepository.save(course);
    return ResponseEntity.status(HttpStatus.OK).body(lessonSaved.getId());
  }

  public ResponseEntity<?> deleteLesson(@PathVariable Long courseId, @PathVariable Long lessonId) {
    List<Lesson> lessonList = lessonRepository.findByCourseId(courseId);
    for (Lesson element : lessonList) {
      if (element.getId() == lessonId) {
        lessonRepository.delete(element);
      }
    }
    return ResponseEntity.ok().body("Lesson deleted");
  }

  public ResponseEntity<?> deleteLessonNormal(@PathVariable Long lessonId) {
    Optional<Lesson> lessonOptional = lessonRepository.findById(lessonId);
    if(!lessonOptional.isPresent()){
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found with ID " + lessonId);
    }
    Lesson lesson = lessonOptional.get();
    lessonRepository.delete(lesson);
    return ResponseEntity.ok().body("Lesson deleted");
  }

  public Optional<Lesson> findById(Long lessonId) {
    return lessonRepository.findById(lessonId);
  }

  public List<Lesson> getAllLessons() { return lessonRepository.findAll(); }

  public List<Lesson> getWithoutQuiz(){
    List<Lesson> allLessons = lessonRepository.findAll();
    List<Lesson> withoutQuiz = new ArrayList<>();
    for(Lesson lesson : allLessons){
      if(lesson.getQuestions().isEmpty()){
        withoutQuiz.add(lesson);
      }
    }
    return withoutQuiz;
  }
}
