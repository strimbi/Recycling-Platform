package ro.ubb.recyclingplatform.mapper;

import ro.ubb.recyclingplatform.dto.report.ReportResponse;
import ro.ubb.recyclingplatform.entity.Report;

public class ReportMapper {
    public static ReportResponse toResponse(Report r) {
        return ReportResponse.builder()
                .id(r.getId())
                .type(r.getType().name())
                .status(r.getStatus().name())
                .description(r.getDescription())
                .locationId(r.getLocation() != null ? r.getLocation().getId() : null)
                .locationName(r.getLocation() != null ? r.getLocation().getName() : null)
                .proposedLat(r.getProposedLat())
                .proposedLng(r.getProposedLng())
                .proposedAddress(r.getProposedAddress())
                .createdByEmail(r.getCreatedBy().getEmail())
                .adminComment(r.getAdminComment())
                .createdAt(r.getCreatedAt())
                .resolvedAt(r.getResolvedAt())
                .build();
    }
}
