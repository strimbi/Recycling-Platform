package ro.ubb.recyclingplatform.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReportRequest {
    @NotNull
    private String type; // FULL_BIN, DAMAGED_BIN, NEW_LOCATION, WRONG_INFO

    @NotBlank
    private String description;

    // optional: existing location
    private Long locationId;

    // only for NEW_LOCATION
    private Double proposedLat;
    private Double proposedLng;
    private String proposedAddress;
}
