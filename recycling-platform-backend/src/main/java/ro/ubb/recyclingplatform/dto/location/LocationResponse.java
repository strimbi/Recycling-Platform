package ro.ubb.recyclingplatform.dto.location;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class LocationResponse {
    private Long id;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String schedule;
    private boolean active;
    private Set<String> acceptedWasteTypes;
}
