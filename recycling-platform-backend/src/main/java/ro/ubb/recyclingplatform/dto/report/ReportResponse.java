package ro.ubb.recyclingplatform.dto.report;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ReportResponse {
    private Long id;
    private String type;
    private String status;
    private String description;

    private Long locationId;
    private String locationName;

    private Double proposedLat;
    private Double proposedLng;
    private String proposedAddress;

    private String createdByEmail;
    private String adminComment;
    private java.util.Set<String> proposedWasteTypes;

    private Instant createdAt;
    private Instant resolvedAt;
}
