package com.project.course.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.course.models.Question;
import jakarta.persistence.*;

public class AnswerDTO {
    private String contents;
    private boolean isCorrect;
    private Long questionId;

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    @JsonProperty("isCorrect")
    public boolean isCorrect() {
        return this.isCorrect;
    }
    @JsonProperty("isCorrect")
    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}
