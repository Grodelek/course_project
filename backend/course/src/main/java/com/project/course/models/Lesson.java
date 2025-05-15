package com.project.course.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Table(name = "lesson")
@Entity
public class Lesson {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "name", nullable = false)
  private String name;
  @Column(name = "description")
  private String description;
  @Column(name = "is_finished", nullable = false)
  private boolean isFinished;
  @ManyToOne
  @JoinColumn(name = "course_id")
  private Course course;
  @ManyToMany(mappedBy = "finishedLessonsList")
  @JsonIgnore
  private List<User> users;
  @OneToMany(mappedBy = "lesson")
  @JsonIgnore
  private List<Sector> sectors = new ArrayList<>();
  @OneToMany(mappedBy = "lesson")
  @JsonIgnore
  private List<Question> questions = new ArrayList<>();

  public List<Question> getQuestions() {
    return questions;
  }

  public void setQuestions(List<Question> questions) {
    this.questions = questions;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return this.description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public boolean getIsFinished() {
    return this.isFinished;
  }

  public void setIsFinished(boolean isFinished) {
    this.isFinished = isFinished;
  }

  public Course getCourse() {
    return course;
  }

  public void setCourse(Course course) {
    this.course = course;
  }
}
