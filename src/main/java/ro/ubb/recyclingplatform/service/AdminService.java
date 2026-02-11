package ro.ubb.recyclingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.ubb.recyclingplatform.entity.*;
import ro.ubb.recyclingplatform.entity.enums.ReportStatus;
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

    public List<Report> listReportsByStatus(String status) {
        if (status == null || status.isBlank()) {
            return reportRepository.findAll();
        }
        return reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.valueOf(status.trim().toUpperCase()));
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
