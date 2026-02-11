package ro.ubb.recyclingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.ubb.recyclingplatform.dto.leaderboard.LeaderboardEntryResponse;
import ro.ubb.recyclingplatform.repository.UserRepository;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;

    public List<LeaderboardEntryResponse> top(int limit) {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparingLong(u -> -u.getPoints()))
                .limit(Math.max(1, limit))
                .map(u -> LeaderboardEntryResponse.builder()
                        .displayName(u.getDisplayName())
                        .points(u.getPoints())
                        .build())
                .toList();
    }
}
