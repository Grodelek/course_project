package com.project.course.models;

import jakarta.persistence.*;

@Entity
@Table(name = "sector")
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    @Column(name = "type", nullable = false)
    private String type;
    @Column(name = "value", nullable = false, columnDefinition = "TEXT")
    private String value;
    @Column(name = "alternative", nullable = true)
    private String alternative;
    @Column(name = "place", nullable = false)
    private int place;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public int getPlace() {
        return place;
    }

    public void setPlace(int place) {
        this.place = place;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAlternative() {
        return alternative;
    }

    public void setAlternative(String alternative) {
        this.alternative = alternative;
    }
}
