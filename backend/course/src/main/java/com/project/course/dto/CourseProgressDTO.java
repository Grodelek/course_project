package com.project.course.dto;

public class CourseProgressDTO {
    private String courseName;
    private Long courseId;
    private int progress;

    public CourseProgressDTO(String courseName, Long courseId, int progress) {
        this.courseName = courseName;
        this.courseId = courseId;
        this.progress = progress;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
}
