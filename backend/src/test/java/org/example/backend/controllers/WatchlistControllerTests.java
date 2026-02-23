package org.example.backend.controllers;

import org.example.backend.models.Watchlist;
import org.example.backend.repositories.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;


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
    void getAllWatchlistsByUser_shouldReturnWatchlistsForUser() throws Exception {
        Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/watchlist/user")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json(
                """
                          [
                             {
                                "id": "1",
                                "userId": "1",
                                "name": "Test Watchlist",
                                "description": "Das ist eine Test Watchlist",
                                "itemIDs": [],
                                "type": "MOVIE"
                             }
                          ]

"""
                ));
    }

    @Test
    void getWatchlistById_shouldReturnWatchlist() throws Exception {
        Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/watchlist/1")
                        .with(oauth2Login()
                            .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json(
                        """
                                     {
                                        "id": "1",
                                        "userId": "1",
                                        "name": "Test Watchlist",
                                        "description": "Das ist eine Test Watchlist",
                                        "itemIDs": [],
                                        "type": "MOVIE"
                                     }
        
        """
                ));
    }

    @Test
    void getWatchlistById_shouldReturn404IfWatchlistNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/watchlist/1")
                        .with(oauth2Login()
                            .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void createWatchlist_shouldReturnNewWatchlist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/watchlist")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                """
                                     {
                                        "name": "Test Watchlist",
                                        "description": "Das ist eine Test Watchlist",
                                        "type": "MOVIE"
                                     }
        
                                """
                        )
                        .with(oauth2Login()
                            .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json(
                        """
                                     {
                                        "name": "Test Watchlist",
                                        "description": "Das ist eine Test Watchlist",
                                        "type": "MOVIE"
                                     }
        
        """
                ));
    }

    @Test
    void updateWatchlist_shouldReturnUpdatedWatchlist() throws Exception {
        Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/watchlist/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                """
                                     {
                                        "name": "Geänderte Test Watchlist",
                                        "description": "Das ist eine geänderte Test Watchlist",
                                        "type": "MOVIE"
                                     }
        
                                """
                        )
                        .with(oauth2Login()
                            .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json(
                                     """
                                     {
                                        "id": "1",
                                        "userId": "1",
                                        "name": "Geänderte Test Watchlist",
                                        "description": "Das ist eine geänderte Test Watchlist",
                                        "itemIDs": [],
                                        "type": "MOVIE"
                                     }
        
                                """
                ));
    }

    @Test
    void updateWatchlist_shouldReturn404IfWatchlistNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/watchlist/1")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void deleteWatchlist_shouldReturnTrueIfSuccessfull() throws Exception {
        Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/watchlist/1")
                .with(oauth2Login()
                        .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void deleteWatchlist_shouldReturn404IfWatchlistNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/watchlist/1")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void addMovieToWatchlist_ShouldReturnUpdatedWatchlist() throws Exception {
        Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/watchlist/1/movie/1")
                .with(oauth2Login()
                        .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json(
                        """
                                     {
                                        "id": "1",
                                        "userId": "1",
                                        "name": "Test Watchlist",
                                        "description": "Das ist eine Test Watchlist",
                                        "itemIDs": [
                                          "1"
                                        ],
                                        "type": "MOVIE"
                                     }
        
        """
                ));
    }

    @Test
    void addMovieToWatchlist_shouldReturn404IfWatchlistNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/watchlist/1/movie/1")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void deleteMovieFromWatchlist_shouldReturnTrueIfSuccessfull() throws Exception {
        List<String> ids = List.of("1", "2", "3", "4", "5");
        Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", ids, "MOVIE");
        repo.save(watchlist);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/watchlist/1/movie/1")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().string("true"));

    }

    @Test
    void deleteMovieFromWatchlist_shouldReturn404IfWatchlistNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/watchlist/1/movie/1")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("sub", "1"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}

