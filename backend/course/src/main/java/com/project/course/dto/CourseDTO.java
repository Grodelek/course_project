package com.project.course.dto;

public class CourseDTO {
  private String name;
  private String description;
  private Long roadmapId;

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

  public Long getRoadmapId() {
    return this.roadmapId;
  }

  public void setRoadmapId(Long roadmapId) {
    this.roadmapId = roadmapId;
  }
}