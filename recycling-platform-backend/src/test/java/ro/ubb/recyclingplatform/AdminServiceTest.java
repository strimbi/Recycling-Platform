package ro.ubb.recyclingplatform;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.ubb.recyclingplatform.entity.Report;
import ro.ubb.recyclingplatform.entity.User;
import ro.ubb.recyclingplatform.entity.enums.ReportStatus;
import ro.ubb.recyclingplatform.entity.enums.ReportType;
import ro.ubb.recyclingplatform.repository.*;
import ro.ubb.recyclingplatform.service.AdminService;
import ro.ubb.recyclingplatform.service.PointsRulesService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock private ReportRepository reportRepository;
    @Mock private UserRepository userRepository;
    @Mock private LocationRepository locationRepository;
    @Mock private PointsRulesService pointsRulesService;
    @Mock private PointsTransactionRepository pointsTransactionRepository;
    @Mock private WasteTypeRepository wasteTypeRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void approveReport_ShouldAwardPointsAndChangeStatus() {
        // Arrange
        User user = User.builder().email("user@test.com").points(50L).build();
        Report report = Report.builder()
                .id(1L)
                .type(ReportType.FULL_BIN)
                .status(ReportStatus.PENDING)
                .createdBy(user)
                .build();

        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));
        when(pointsRulesService.pointsFor(ReportType.FULL_BIN)).thenReturn(10L);
        when(reportRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Report result = adminService.approveReport(1L, null, "Approved");

        // Assert
        assertEquals(ReportStatus.APPROVED, result.getStatus());
        assertEquals(60L, user.getPoints());
        verify(userRepository).save(user);
        verify(pointsTransactionRepository).save(any());
    }

    @Test
    void rejectReport_ShouldChangeStatusToRejected() {
        // Arrange
        Report report = Report.builder()
                .id(2L)
                .status(ReportStatus.PENDING)
                .build();

        when(reportRepository.findById(2L)).thenReturn(Optional.of(report));
        when(reportRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Report result = adminService.rejectReport(2L, "Not a valid report");

        // Assert
        assertEquals(ReportStatus.REJECTED, result.getStatus());
        assertEquals("Not a valid report", result.getAdminComment());
    }
}