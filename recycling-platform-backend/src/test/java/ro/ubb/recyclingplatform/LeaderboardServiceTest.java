package ro.ubb.recyclingplatform;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.ubb.recyclingplatform.dto.leaderboard.LeaderboardEntryResponse;
import ro.ubb.recyclingplatform.entity.User;
import ro.ubb.recyclingplatform.repository.UserRepository;
import ro.ubb.recyclingplatform.service.LeaderboardService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeaderboardServiceTest {

    @Mock private UserRepository userRepository;
    @InjectMocks private LeaderboardService leaderboardService;

    @Test
    void top_ShouldReturnSortedUsersWithLimit() {
        // Arrange
        User u1 = User.builder().displayName("User1").points(100L).build();
        User u2 = User.builder().displayName("User2").points(200L).build();
        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        // Act
        List<LeaderboardEntryResponse> result = leaderboardService.top(1);

        // Assert
        assertEquals(1, result.size());
        assertEquals("User2", result.get(0).getDisplayName());
        assertEquals(200L, result.get(0).getPoints());
    }
}