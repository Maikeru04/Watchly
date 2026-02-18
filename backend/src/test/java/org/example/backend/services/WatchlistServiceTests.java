package org.example.backend.services;

import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.exceptions.WatchlistNotFoundException;
import org.example.backend.models.Watchlist;
import org.example.backend.repositories.WatchlistRepository;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class WatchlistServiceTests {

    private final WatchlistRepository mockRepo = mock(WatchlistRepository.class);
    private final WatchlistService service = new WatchlistService(mockRepo);

    private final Watchlist watchlist = new Watchlist("1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
    private final Watchlist watchlistWithItemIDs = new Watchlist("2", "Test Watchlist", "Das ist eine Test Watchlist", List.of("1", "2", "3"), "MOVIE");
    private final WatchlistInDto watchlistInDto = new WatchlistInDto("Test Watchlist", "Das ist eine Test Watchlist", "MOVIE");

    @Test
    void getAllWatchlists_shouldReturnWatchlists() {
        //GIVEN
        List<Watchlist> expected = List.of(watchlist);
        when(mockRepo.findAll()).thenReturn(expected);

        //WHEN
        List<Watchlist> result = service.getAllWatchlists();

        //THEN
        assertEquals(expected, result);
        verify(mockRepo).findAll();
    }

    @Test
    void getWatchlistById_shouldReturnWatchlist() {
        //GIVEN
        when(mockRepo.findById(watchlist.id())).thenReturn(Optional.of(watchlist));

        //WHEN
        Watchlist result = service.getWatchlistById(watchlist.id());

        //THEN
        assertEquals(watchlist, result);
        verify(mockRepo).findById(watchlist.id());
    }

    @Test
    void getWatchlistById_shouldThrowExceptionIfNotFound() {
        //GIVEN
        when(mockRepo.findById("")).thenReturn(Optional.empty());

        //WHEN + THEN
        assertThatThrownBy(() -> service.getWatchlistById(""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }

    @Test
    void createWatchlist_shouldReturnNewWatchlist() {
        //GIVEN
        when(mockRepo.save(any(Watchlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //WHEN
        Watchlist result = service.createWatchlist(watchlistInDto);

        //THEN
        assertThat(result).isNotNull();
        assertThat(result.id()).isNotNull();
        assertThat(result.name()).isEqualTo(watchlistInDto.name());
        assertThat(result.description()).isEqualTo(watchlistInDto.description());
        assertThat(result.type()).isEqualTo(watchlistInDto.type());
        verify(mockRepo).save(any(Watchlist.class));
    }

    @Test
    void updateWatchlist_shouldReturnUpdatedWatchlistById() {
        //GIVEN
        WatchlistInDto newWatchlist = new WatchlistInDto("Changed Test Watchlist", "Das ist eine geänderte Test Watchlist", "MOVIE");
        when(mockRepo.findById(watchlist.id())).thenReturn(Optional.of(watchlist));
        when(mockRepo.save(any(Watchlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //WHEN
        Watchlist result = service.updateWatchlistById("1", newWatchlist);

        //THEN
        assertThat(result).isNotNull();
        assertThat(result.description()).isEqualTo(newWatchlist.description());
        assertThat(result.name()).isEqualTo(newWatchlist.name());
        verify(mockRepo).findById("1");
        verify(mockRepo).save(any(Watchlist.class));
    }

    @Test
    void updateWatchlist_ById_shouldThrowExceptionIfNotFound() {
        //GIVEN
        when(mockRepo.findById("")).thenReturn(Optional.empty());

        //WHEN + THEN
        assertThatThrownBy(() -> service.updateWatchlistById("", watchlistInDto))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }

    @Test
    void deleteWatchlist_ById_shouldReturnTrueIfSuccessfull() {
        //GIVEN
        when(mockRepo.existsById(watchlist.id())).thenReturn(true);
        doNothing().when(mockRepo).deleteById(watchlist.id());

        //WHEN
        boolean result = service.deleteWatchlistById(watchlist.id());

        //THEN
        assertTrue(result);
        verify(mockRepo).deleteById("1");
    }

    @Test
    void deleteWatchlist_ById_shouldThrowExceptionIfNotSuccessfull() {
        assertThatThrownBy(() -> service.deleteWatchlistById(""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }

    @Test
    void addMovieToWatchlist_ShouldReturnUpdatedWatchlist() {
        //GIVEN
        List<String> id = List.of("1");
        when(mockRepo.findById(watchlist.id())).thenReturn(Optional.of(watchlist));
        when(mockRepo.save(any(Watchlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //WHEN
        Watchlist result = service.addMovieToWatchlist("1", "1");

        //THEN
        assertThat(result).isNotNull();
        assertThat(result.itemIDs()).isEqualTo(id);
        verify(mockRepo).findById("1");
        verify(mockRepo).save(any(Watchlist.class));
    }

    @Test
    void addMovieToWatchlist_shouldThrowExceptionIfWatchlistNotFound() {
        assertThatThrownBy(() -> service.addMovieToWatchlist("", ""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }

    @Test
    void deleteMovieFromWatchlist_shouldReturnTrueIfSuccessfull() {
        //GIVEN
        when(mockRepo.existsById(watchlistWithItemIDs.id())).thenReturn(true);
        when(mockRepo.findById(watchlistWithItemIDs.id())).thenReturn(Optional.of(watchlist));

        //WHEN
        boolean result = service.deleteMovieFromWatchlist("2", "1");

        //THEN
        assertTrue(result);
        verify(mockRepo).findById("2");
        verify(mockRepo).save(any(Watchlist.class));
    }

    @Test
    void deleteMovieFromWatchlist_shouldThrowExceptionIfWatchlistNotFound() {
        assertThatThrownBy(() -> service.deleteMovieFromWatchlist("", ""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }
}

