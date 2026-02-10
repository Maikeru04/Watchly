package org.example.backend.controllers;

import org.example.backend.repositories.WatchlistRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
public class WatchlistControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WatchlistRepository repo;

    @BeforeEach
    void cleanDb() {
        repo.deleteAll();
    }

    @Test
    void getAllWatchlists_shouldReturnWatchlists() {

    }

    @Test
    void getWatchlistById_shouldReturnWatchlist() {

    }

    @Test
    void getWatchlistById_shouldReturn404IfWatchlistNotFound() {

    }

    @Test
    void createWatchlist_shouldReturnNewWatchlist() {

    }

    @Test
    void updateWatchlist_shouldReturnUpdatedWatchlist() {

    }

    @Test
    void updateWatchlist_shouldReturn404IfWatchlistNotFound() {

    }

    @Test
    void deleteWatchlist_shouldReturnTrueIfSuccessfull() {

    }

    @Test
    void deleteWatchlist_shouldReturn404IfWatchlistNotFound() {

    }
}
