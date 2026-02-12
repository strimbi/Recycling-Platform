package ro.ubb.recyclingplatform.service;

import org.springframework.stereotype.Service;
import ro.ubb.recyclingplatform.entity.enums.ReportType;

import java.util.EnumMap;
import java.util.Map;

@Service
public class PointsRulesService {

    private final Map<ReportType, Long> rules = new EnumMap<>(ReportType.class);

    public PointsRulesService() {
        rules.put(ReportType.FULL_BIN, 10L);
        rules.put(ReportType.DAMAGED_BIN, 15L);
        rules.put(ReportType.WRONG_INFO, 5L);
        rules.put(ReportType.NEW_LOCATION, 25L);
    }

    public long pointsFor(ReportType type) {
        return rules.getOrDefault(type, 0L);
    }
}
