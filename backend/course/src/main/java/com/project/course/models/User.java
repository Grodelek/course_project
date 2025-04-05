package com.project.course.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  @Column(name = "email", unique = true)
  private String email;
  @Column(name = "password")
  private String password;
  @Column(name = "roles")
  private String roles;
  @Column(name = "isConfirmed")
  private char isConfirmed;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = false)
  private List<Ban> listBan = new ArrayList<>();

  public List<Ban> getListBan() {
    return listBan;
  }

  public void setListBan(List<Ban> listBan) {
    this.listBan = listBan;
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

  public int getId() {
    return id;
  }

  public void setId(int id) {
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
}
