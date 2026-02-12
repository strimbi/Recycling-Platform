package ro.ubb.recyclingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.ubb.recyclingplatform.dto.report.CreateReportRequest;
import ro.ubb.recyclingplatform.entity.*;
import ro.ubb.recyclingplatform.entity.enums.*;
import ro.ubb.recyclingplatform.repository.*;

import java.time.Instant;
import java.util.List;
import java.util.Set;

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

        // VALIDARE
        if (type == ReportType.NEW_LOCATION) {
            if (req.getProposedLat() == null || req.getProposedLng() == null) {
                throw new IllegalArgumentException("For NEW_LOCATION, proposedLat and proposedLng are required");
            }
        } else {
            if (req.getLocationId() == null) {
                throw new IllegalArgumentException("locationId is required for report type " + type);
            }
        }

        RecyclingLocation location = null;
        if (req.getLocationId() != null) {
            location = locationRepository.findById(req.getLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Location not found"));
        }

        var proposedTypes = (req.getProposedWasteTypes() == null)
                ? Set.<String>of()
                : req.getProposedWasteTypes().stream()
                .map(s -> s.trim().toUpperCase())
                .collect(java.util.stream.Collectors.toSet());


        Report report = Report.builder()
                .type(type)
                .status(ReportStatus.PENDING)
                .description(req.getDescription().trim())
                .location(location)
                .proposedWasteTypes(proposedTypes)
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
