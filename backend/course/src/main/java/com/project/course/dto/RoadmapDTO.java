package com.project.course.dto;

import java.util.List;

public class RoadmapDTO {
  private String name;
  private List<Long> courseIds;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Long> getCourseIds() {
    return courseIds;
  }

  public void setCourseIds(List<Long> courseIds) {
    this.courseIds = courseIds;
  }
}