package ro.ubb.recyclingplatform.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.leaderboard.LeaderboardEntryResponse;
import ro.ubb.recyclingplatform.service.LeaderboardService;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public List<LeaderboardEntryResponse> top(@RequestParam(defaultValue = "10") int limit) {
        return leaderboardService.top(limit);
    }
}
