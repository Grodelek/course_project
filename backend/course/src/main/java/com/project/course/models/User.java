package com.project.course.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "email", unique = true)
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

  @ManyToMany
  @JoinTable(name = "user_finished_courses", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
  private List<Course> finishedCoursesList;
  @ManyToMany
  @JoinTable(name = "user_finished_lessons", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "lesson_id"))
  private List<Lesson> finishedLessonsList;

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
}
