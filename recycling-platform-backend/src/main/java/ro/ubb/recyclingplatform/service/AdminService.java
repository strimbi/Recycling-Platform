package ro.ubb.recyclingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ubb.recyclingplatform.entity.PointsTransaction;
import ro.ubb.recyclingplatform.entity.RecyclingLocation;
import ro.ubb.recyclingplatform.entity.Report;
import ro.ubb.recyclingplatform.entity.User;
import ro.ubb.recyclingplatform.entity.enums.ReportStatus;
import ro.ubb.recyclingplatform.entity.enums.ReportType;
import ro.ubb.recyclingplatform.repository.*;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PointsTransactionRepository pointsTransactionRepository;
    private final PointsRulesService pointsRulesService;
    private final LocationRepository locationRepository;
    private final WasteTypeRepository wasteTypeRepository;

    public List<Report> listReportsByStatus(String status) {
        if (status == null || status.isBlank()) {
            return reportRepository.findAll();
        }
        return reportRepository.findByStatusOrderByCreatedAtDesc(
                ReportStatus.valueOf(status.trim().toUpperCase())
        );
    }

    @Transactional
    public Report approveReport(Long reportId, Long pointsOverride, String adminComment) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalArgumentException("Report already resolved");
        }

        long pointsToAward = (pointsOverride != null && pointsOverride > 0)
                ? pointsOverride
                : pointsRulesService.pointsFor(report.getType());

        // If NEW_LOCATION approved => create a new RecyclingLocation automatically (with proposed waste types if any)
        if (report.getType() == ReportType.NEW_LOCATION) {
            if (report.getProposedLat() == null || report.getProposedLng() == null) {
                throw new IllegalArgumentException("NEW_LOCATION report missing proposed coordinates");
            }

            String addr = (report.getProposedAddress() == null || report.getProposedAddress().isBlank())
                    ? "Proposed location (no address provided)"
                    : report.getProposedAddress().trim();

            RecyclingLocation newLoc = RecyclingLocation.builder()
                    .name("Proposed location by " + report.getCreatedBy().getDisplayName())
                    .address(addr)
                    .latitude(report.getProposedLat())
                    .longitude(report.getProposedLng())
                    .active(true)
                    .build();

            // Apply proposed waste types (if present)
            var proposed = report.getProposedWasteTypes();
            if (proposed != null && !proposed.isEmpty()) {
                var wasteTypes = proposed.stream()
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .map(name -> wasteTypeRepository.findByName(name)
                                .orElseThrow(() -> new IllegalArgumentException("Unknown waste type: " + name)))
                        .collect(java.util.stream.Collectors.toSet());

                newLoc.setAcceptedWasteTypes(wasteTypes);
            }

            newLoc = locationRepository.save(newLoc);

            // Link report to the created location (useful for audit)
            report.setLocation(newLoc);
        }

        report.setStatus(ReportStatus.APPROVED);
        report.setAdminComment(adminComment);
        report.setResolvedAt(Instant.now());

        // award points
        User user = report.getCreatedBy();
        user.setPoints(user.getPoints() + pointsToAward);
        userRepository.save(user);

        pointsTransactionRepository.save(PointsTransaction.builder()
                .user(user)
                .report(report)
                .points(pointsToAward)
                .createdAt(Instant.now())
                .build());

        return reportRepository.save(report);
    }

    @Transactional
    public Report rejectReport(Long reportId, String adminComment) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalArgumentException("Report already resolved");
        }

        report.setStatus(ReportStatus.REJECTED);
        report.setAdminComment(adminComment);
        report.setResolvedAt(Instant.now());

        return reportRepository.save(report);
    }
}
