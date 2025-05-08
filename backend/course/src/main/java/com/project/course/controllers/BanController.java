package com.project.course.controllers;

import com.project.course.models.Ban;
import com.project.course.services.BanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class BanController {
    private final BanService banService;

    @Autowired
    public BanController(BanService banService) {
        this.banService = banService;
    }

    @PostMapping("/ban")
    public ResponseEntity<?> ban(@RequestBody Ban ban) { return banService.giveBan(ban); }
}
