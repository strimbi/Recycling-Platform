package ro.ubb.recyclingplatform.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.auth.AuthResponse;
import ro.ubb.recyclingplatform.entity.enums.Role;
import ro.ubb.recyclingplatform.repository.UserRepository;
import ro.ubb.recyclingplatform.security.JwtService;

@Profile("dev")
@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class DevController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/make-me-admin")
    public AuthResponse makeMeAdmin(Authentication auth) {
        String email = auth.getName();

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setRole(Role.ADMIN);
        userRepository.save(user);

        // token nou
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole().name())
                .build();
    }
}
