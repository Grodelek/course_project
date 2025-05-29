package com.project.course.dto;

import java.util.List;

public class RoadmapDTO {
  private String name;
  private List<String> courseTitles;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<String> getCourseTitles() {
    return courseTitles;
  }

  public void setCourseTitles(List<String> courseTitles) {
    this.courseTitles = courseTitles;
  }

}
