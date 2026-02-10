package org.example.backend.controllers;

import org.example.backend.models.Watchlist;
import org.example.backend.repositories.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

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
    void getAllWatchlists_shouldReturnWatchlists() throws Exception {
        Watchlist watchlist = new Watchlist("1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>());
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/watchlist"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json(
                """
                          [
                             {
                                "id": "1",
                                "name": "Test Watchlist",
                                "description": "Das ist eine Test Watchlist",
                                "itemIDs": []
                             }
                          ]

"""
                ));
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
