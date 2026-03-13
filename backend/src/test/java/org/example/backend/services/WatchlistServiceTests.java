package org.example.backend.services;

import org.example.backend.dtos.WatchlistInDto;
import org.example.backend.exceptions.WatchlistNotFoundException;
import org.example.backend.models.Item;
import org.example.backend.models.Watchlist;
import org.example.backend.repositories.WatchlistRepository;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;


public class WatchlistServiceTests {

    private final WatchlistRepository mockRepo = mock(WatchlistRepository.class);
    private final WatchlistService service = new WatchlistService(mockRepo);

    private final Watchlist watchlist = new Watchlist("1", "1", "Test Watchlist", "Das ist eine Test Watchlist", new ArrayList<>(), "MOVIE");
    private final Item item = new Item("1", "movie", 0);
    private final Watchlist watchlistWithItems = new Watchlist("2", "1", "Test Watchlist", "Das ist eine Test Watchlist", List.of(item), "MOVIE");
    private final WatchlistInDto watchlistInDto = new WatchlistInDto("Test Watchlist", "Das ist eine Test Watchlist", "MOVIE");
    private final Watchlist completed = new Watchlist("Completed", "1", "Completed", "Movies you already completed will land here!", new ArrayList<>(), "Completed");

    @Test
    void getAllWatchlists_shouldReturnWatchlists() {
        //GIVEN
        List<Watchlist> expected = List.of(watchlist);
        when(mockRepo.findByUserId(watchlist.userId())).thenReturn(expected);

        //WHEN
        List<Watchlist> result = service.getWatchlistsByUser(watchlist.userId());

        //THEN
        assertEquals(expected, result);
        verify(mockRepo).findByUserId(watchlist.userId());
    }


    @Test
    void getWatchlistById_shouldReturnWatchlist() {
        //GIVEN
        when(mockRepo.findById(watchlist.id())).thenReturn(Optional.of(watchlist));

        //WHEN
        Watchlist result = service.getWatchlistById(watchlist.id(), watchlist.userId());

        //THEN
        assertEquals(watchlist, result);
        verify(mockRepo).findById(watchlist.id());
    }

    @Test
    void getWatchlistById_shouldThrowRuntimeException() {
        //GIVEN
        when(mockRepo.findById(watchlist.id())).thenReturn(Optional.of(watchlist));

        //WHEN
        assertThrows(RuntimeException.class, () -> {
            service.getWatchlistById(watchlist.id(), "2");
        });

        //THEN
        verify(mockRepo).findById(watchlist.id());
    }

    @Test
    void getWatchlistById_shouldThrowExceptionIfNotFound() {
        //GIVEN
        when(mockRepo.findById("")).thenReturn(Optional.empty());

        //WHEN + THEN
        assertThatThrownBy(() -> service.getWatchlistById("", ""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }

    @Test
    void createWatchlist_shouldReturnNewWatchlist() {
        //GIVEN
        when(mockRepo.save(any(Watchlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //WHEN
        Watchlist result = service.createWatchlist(watchlistInDto, "1");

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
    void swapMovieBetweenWatchlists_shouldMoveItemBetweenWatchlists() {
        // GIVEN
        Watchlist current = new Watchlist("1", "1", "Current", "desc", List.of(item), "MOVIE");
        Watchlist target = new Watchlist("2", "1", "Target", "desc", new ArrayList<>(), "MOVIE");

        when(mockRepo.existsById("1")).thenReturn(true);
        when(mockRepo.existsById("2")).thenReturn(true);

        when(mockRepo.findById("1")).thenReturn(Optional.of(current));
        when(mockRepo.findById("2")).thenReturn(Optional.of(target));

        when(mockRepo.save(any(Watchlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        List<Watchlist> result = service.swapMovieBetweenWatchlists("1", "2", item, "1");

        // THEN
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);

        Watchlist updatedCurrent = result.get(0);
        Watchlist updatedTarget = result.get(1);

        assertThat(updatedCurrent.items()).doesNotContain(item);
        assertThat(updatedTarget.items()).contains(item);

        verify(mockRepo).findById("1");
        verify(mockRepo).findById("2");
        verify(mockRepo, times(2)).save(any(Watchlist.class));
    }

    @Test
    void swapMovieBetweenWatchlists_shouldThrowExceptionIfCurrentWatchlistNotFound() {
        // GIVEN
        when(mockRepo.existsById("1")).thenReturn(false);

        // WHEN + THEN
        assertThatThrownBy(() -> service.swapMovieBetweenWatchlists("1", "2", item, "1"))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID 1 nicht gefunden");
    }

    @Test
    void swapMovieBetweenWatchlists_shouldThrowExceptionIfTargetWatchlistNotFound() {
        // GIVEN
        when(mockRepo.existsById("1")).thenReturn(true);
        when(mockRepo.existsById("2")).thenReturn(false);

        // WHEN + THEN
        assertThatThrownBy(() -> service.swapMovieBetweenWatchlists("1", "2", item, "1"))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID 2 nicht gefunden");
    }

    @Test
    void addMovieToWatchlist_ShouldReturnUpdatedWatchlist() {
        //GIVEN
        List<Item> items = List.of(item);
        when(mockRepo.existsById("1")).thenReturn(true);
        when(mockRepo.findById(watchlist.id())).thenReturn(Optional.of(watchlist));
        when(mockRepo.save(any(Watchlist.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //WHEN
        Watchlist result = service.addMovieToWatchlist("1", item, "1");

        //THEN
        assertThat(result).isNotNull();
        assertThat(result.items()).isEqualTo(items);
        verify(mockRepo).findById("1");
        verify(mockRepo).save(any(Watchlist.class));
    }

    @Test
    void addMovieToWatchlist_shouldThrowExceptionIfWatchlistNotFound() {
        assertThatThrownBy(() -> service.addMovieToWatchlist("", item, ""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }

    @Test
    void deleteMovieFromWatchlist_shouldReturnTrueIfSuccessfull() {
        //GIVEN
        when(mockRepo.existsById(watchlistWithItems.id())).thenReturn(true);
        when(mockRepo.existsById("Completed")).thenReturn(true);
        when(mockRepo.findById(watchlistWithItems.id())).thenReturn(Optional.of(watchlist));
        when(mockRepo.findById("Completed")).thenReturn(Optional.of(completed));

        //WHEN
        boolean result = service.deleteMovieFromWatchlist("2", item, "1");

        //THEN
        assertTrue(result);
        verify(mockRepo).findById("2");
        verify(mockRepo).save(any(Watchlist.class));
    }

    @Test
    void deleteMovieFromWatchlist_shouldCreateCompletedWatchlist() {
        //GIVEN
        when(mockRepo.existsById("1")).thenReturn(true);
        when(mockRepo.existsById("Completed")).thenReturn(false);
        when(mockRepo.findById("1")).thenReturn(Optional.of(watchlistWithItems));
        when(mockRepo.findById("Completed")).thenReturn(Optional.of(completed));

        //WHEN
        service.deleteMovieFromWatchlist("1", new Item("1", "movie", 5), "1");

        //THEN
        verify(mockRepo, times(3)).save(any(Watchlist.class));

    }

    @Test
    void deleteMovieFromWatchlist_shouldNotAddToCompleted() {
        //GIVEN
        when(mockRepo.existsById("1")).thenReturn(true);
        when(mockRepo.existsById("Completed")).thenReturn(true);
        when(mockRepo.findById("1")).thenReturn(Optional.of(watchlistWithItems));
        when(mockRepo.findById("Completed")).thenReturn(Optional.of(completed));

        //WHEN
        service.deleteMovieFromWatchlist("1", new Item("1", "movie", 0), "1");

        //THEN
        verify(mockRepo, never()).save(argThat(w -> w.id().equals("Completed") && w.items().contains(item)));
    }

    @Test
    void deleteMovieFromWatchlist_shouldRemoveItemFromCompletedWhenDeletingFromCompleted() {
        //GIVEN
        when(mockRepo.existsById("Completed")).thenReturn(true);
        when(mockRepo.findById("Completed")).thenReturn(Optional.of(completed));

        //WHEN
        service.deleteMovieFromWatchlist("Completed", item, "1");

        //THEN
        verify(mockRepo, times(2)).save(any(Watchlist.class));
    }

    @Test
    void deleteMovieFromWatchlist_shouldThrowExceptionIfWatchlistNotFound() {
        //GIVEN
        when(mockRepo.existsById("")).thenReturn(false);

        //WHEN + THEN
        assertThatThrownBy(() -> service.deleteMovieFromWatchlist("", item, ""))
                .isInstanceOf(WatchlistNotFoundException.class)
                .hasMessage("Watchlist mit ID  nicht gefunden");
    }


}