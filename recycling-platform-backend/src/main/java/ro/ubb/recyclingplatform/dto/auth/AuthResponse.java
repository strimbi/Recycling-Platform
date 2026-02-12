package ro.ubb.recyclingplatform.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private String displayName;
    private String role;
}
