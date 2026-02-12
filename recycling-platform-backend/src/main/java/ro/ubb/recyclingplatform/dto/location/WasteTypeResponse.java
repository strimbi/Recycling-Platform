package ro.ubb.recyclingplatform.dto.location;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WasteTypeResponse {
    private Long id;
    private String name;
}
