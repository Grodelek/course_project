package com.project.course.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "course")
public class Course {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "name")
  private String name;
  @Column(name = "description")
  private String description;
  @Column(name = "length")
  private String length;
  @Column(name = "rating")
  private int rating;
  @ManyToOne
  @JoinColumn(name = "roadmap_id")
  @JsonIgnore
  private Roadmap roadmap;
  @ManyToMany(mappedBy = "finishedCoursesList")
  @JsonIgnore
  private List<User> users;

  public Roadmap getRoadmap() {
    return roadmap;
  }

  public void setRoadmap(Roadmap roadmap) {
    this.roadmap = roadmap;
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

  public String getLength() {
    return this.length;
  }

  public void setLength(String length) {
    this.length = length;
  }

  public int getRating() {
    return this.rating;
  }

  public void setRating(int rating) {
    this.rating = rating;
  }

  public List<User> getUsers() {
    return users;
  }

  public void setUsers(List<User> users) {
    this.users = users;
  }
}
