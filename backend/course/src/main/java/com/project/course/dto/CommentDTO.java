package com.project.course.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.course.models.Course;
import com.project.course.models.User;
import jakarta.persistence.*;

import java.util.Date;

public class CommentDTO {
    private String contents;
    private Long course_id;
    private String user_email;

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Long getCourse_id() {
        return course_id;
    }

    public void setCourse_id(Long course_id) {
        this.course_id = course_id;
    }

    public String getUser_email() {
        return user_email;
    }

    public void setUser_email(String user_email) {
        this.user_email = user_email;
    }

}
