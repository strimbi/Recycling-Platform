package ro.ubb.recyclingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.ubb.recyclingplatform.dto.report.CreateReportRequest;
import ro.ubb.recyclingplatform.entity.*;
import ro.ubb.recyclingplatform.entity.enums.*;
import ro.ubb.recyclingplatform.repository.*;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    public Report createReport(String userEmail, CreateReportRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ReportType type = ReportType.valueOf(req.getType().trim().toUpperCase());

        RecyclingLocation location = null;
        if (req.getLocationId() != null) {
            location = locationRepository.findById(req.getLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Location not found"));
        }

        Report report = Report.builder()
                .type(type)
                .status(ReportStatus.PENDING)
                .description(req.getDescription().trim())
                .location(location)
                .proposedLat(req.getProposedLat())
                .proposedLng(req.getProposedLng())
                .proposedAddress(req.getProposedAddress())
                .createdBy(user)
                .createdAt(Instant.now())
                .build();

        return reportRepository.save(report);
    }

    public List<Report> listMine(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return reportRepository.findByCreatedByOrderByCreatedAtDesc(user);
    }
}
