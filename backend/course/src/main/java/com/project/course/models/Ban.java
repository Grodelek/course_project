package com.project.course.models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "ban")
public class Ban {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  @Column(name = "date_start")
  private Date date_start;
  @Column(name = "date_end")
  private Date date_end;
  @Column(name = "reason")
  private String reason;
  @Column(name = "email")
  private String email;

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Date getDate_start() {
    return date_start;
  }

  public void setDate_start(Date date_start) {
    this.date_start = date_start;
  }

  public Date getDate_end() {
    return date_end;
  }

  public void setDate_end(Date date_end) {
    this.date_end = date_end;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }

}
