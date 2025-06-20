package com.project.course.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "email", unique = true)
  @Pattern(regexp = "(?i)[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}")
  private String email;
  @Column(name = "password")
  private String password;
  @Column(name = "roles")
  private String roles;
  @Column(name = "userName")
  private String username;
  @Column(name = "isConfirmed")
  private char isConfirmed;
  @Column(name = "photo_path")
  private String photoPath;
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  @JsonIgnore
  private List<Comment> comments = new ArrayList<>();
  @Column(name = "auth_token")
  private String authToken;
  @ManyToMany
  @JoinTable(name = "user_finished_roadmaps", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "roadmap_id"))
  private List<Roadmap> finishedRoadmapsList;
  @ManyToMany
  @JoinTable(name = "user_finished_courses", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
  private List<Course> finishedCoursesList;
  @ManyToMany
  @JoinTable(name = "user_finished_lessons", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "lesson_id"))
  private List<Lesson> finishedLessonsList;

  public List<Lesson> getFinishedLessonsList() {
    return finishedLessonsList;
  }

  public void setFinishedLessonsList(List<Lesson> finishedLessonsList) {
    this.finishedLessonsList = finishedLessonsList;
  }

  public String getPhotoPath() {
    return photoPath;
  }

  public void setPhotoPath(String photoPath) {
    this.photoPath = photoPath;
  }

  public char getIsConfirmed() {
    return isConfirmed;
  }

  public void setIsConfirmed(char isConfirmed) {
    this.isConfirmed = isConfirmed;
  }

  public String getRoles() {
    return roles;
  }

  public void setRoles(String roles) {
    this.roles = roles;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public List<Course> getFinishedCoursesList() {
    return finishedCoursesList;
  }

  public void setFinishedCoursesList(List<Course> finishedCoursesList) {
    this.finishedCoursesList = finishedCoursesList;
  }

  public List<Comment> getComments() {
    return comments;
  }

  public void setComments(List<Comment> comments) {
    this.comments = comments;
  }

  public List<Roadmap> getFinishedRoadmapsList() {
    return finishedRoadmapsList;
  }

  public void setFinishedRoadmapsList(List<Roadmap> finishedRoadmapsList) {
    this.finishedRoadmapsList = finishedRoadmapsList;
  }

  public String getAuthToken() {
    return authToken;
  }

  public void setAuthToken(String authToken) {
    this.authToken = authToken;
  }
}
