package ro.ubb.recyclingplatform.dto.leaderboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardEntryResponse {
    private String displayName;
    private long points;
}
