package ro.ubb.recyclingplatform;

import org.junit.jupiter.api.Test;
import ro.ubb.recyclingplatform.entity.enums.ReportType;
import ro.ubb.recyclingplatform.service.PointsRulesService;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PointsRulesServiceTest {

    private final PointsRulesService pointsRulesService = new PointsRulesService();

    @Test
    void pointsFor_ShouldReturnCorrectValue() {
        assertEquals(25L, pointsRulesService.pointsFor(ReportType.NEW_LOCATION));
        assertEquals(10L, pointsRulesService.pointsFor(ReportType.FULL_BIN));
        assertEquals(0L, pointsRulesService.pointsFor(null));
    }
}