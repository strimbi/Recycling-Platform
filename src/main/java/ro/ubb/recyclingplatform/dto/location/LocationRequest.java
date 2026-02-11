package ro.ubb.recyclingplatform.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class LocationRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private String schedule;

    // list of WasteType names like ["PLASTIC","GLASS"]
    private Set<String> acceptedWasteTypes;
}
