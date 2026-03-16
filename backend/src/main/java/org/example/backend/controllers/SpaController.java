package org.example.backend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {"/", "/watchlist", "/search"})
    public String forward() {
        return "forward:/index.html";
    }
}