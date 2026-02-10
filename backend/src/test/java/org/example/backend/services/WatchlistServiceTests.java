package org.example.backend.services;

import org.example.backend.repositories.WatchlistRepository;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;

public class WatchlistServiceTests {

    private final WatchlistRepository mockRepo = mock(WatchlistRepository.class);
    private final WatchlistService service = new WatchlistService(mockRepo);

    @Test
    void getAllWatchlists_shouldReturnWatchlists() {

    }

    @Test
    void getWatchlistById_shouldReturnWatchlist() {

    }

    @Test
    void getWatchlistById_shouldThrowExceptionIfNotFound() {

    }

    @Test
    void createWatchlist_shouldReturnNewWatchlist() {

    }

    @Test
    void updateWatchlist_shouldReturnUpdatedWatchlist() {

    }

    @Test
    void updateWatchlist_shouldThrowExceptionIfNotFound() {

    }

    @Test
    void deleteWatchlist_shouldReturnTrueIfSuccessfull() {

    }

    @Test
    void deleteWatchlist_shouldThrowExceptionIfNotSuccessfull() {

    }
}

