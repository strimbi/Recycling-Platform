package ro.ubb.recyclingplatform;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.ubb.recyclingplatform.dto.report.CreateReportRequest;
import ro.ubb.recyclingplatform.entity.User;
import ro.ubb.recyclingplatform.repository.LocationRepository;
import ro.ubb.recyclingplatform.repository.ReportRepository;
import ro.ubb.recyclingplatform.repository.UserRepository;
import ro.ubb.recyclingplatform.service.ReportService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock private ReportRepository reportRepository;
    @Mock private UserRepository userRepository;
    @Mock private LocationRepository locationRepository;

    @InjectMocks private ReportService reportService;

    @Test
    void createReport_ShouldThrowException_WhenNewLocationMissingCoords() {
        CreateReportRequest req = new CreateReportRequest();
        req.setType("NEW_LOCATION");
        req.setDescription("Locatie noua");

        User user = User.builder().email("test@test.com").build();
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> reportService.createReport("test@test.com", req));
    }
}