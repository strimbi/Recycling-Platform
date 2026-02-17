package ro.ubb.recyclingplatform.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.ubb.recyclingplatform.dto.auth.AuthResponse;
import ro.ubb.recyclingplatform.dto.auth.LoginRequest;
import ro.ubb.recyclingplatform.dto.auth.RegisterRequest;
import ro.ubb.recyclingplatform.entity.User;
import ro.ubb.recyclingplatform.entity.enums.Role;
import ro.ubb.recyclingplatform.repository.UserRepository;
import ro.ubb.recyclingplatform.security.JwtService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("test@example.com")
                .passwordHash("encoded_password")
                .displayName("Test User")
                .role(Role.USER)
                .build();
    }

    @Test
    @DisplayName("Login - Succes: Returnează token când datele sunt corecte")
    void login_Success() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("parola123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("parola123", "encoded_password")).thenReturn(true);
        when(jwtService.generateToken(any(), any())).thenReturn("mocked_jwt_token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("mocked_jwt_token", response.getToken());
        assertEquals("test@example.com", response.getEmail());
        verify(jwtService).generateToken("test@example.com", "USER");
    }

    @Test
    @DisplayName("Login - Fail, arunca exceptie pentru parola greșita")
    void login_WrongPassword_ThrowsException() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("parola_gresita");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("parola_gresita", "encoded_password")).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> authService.login(loginRequest));
    }

    @Test
    @DisplayName("Register - Succes, salveaza user-ul si returneaza token-ul")
    void register_Success() {
        // Arrange
        RegisterRequest regReq = new RegisterRequest();
        regReq.setEmail("new@example.com");
        regReq.setPassword("password123");
        regReq.setDisplayName("New User");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");
        when(jwtService.generateToken(any(), any())).thenReturn("new_token");

        // Act
        AuthResponse response = authService.register(regReq);

        // Assert
        assertNotNull(response);
        verify(userRepository, times(1)).save(any(User.class));
        assertEquals("new_token", response.getToken());
    }

    @Test
    @DisplayName("Register - Exception cand email-ul exista deja")
    void register_EmailExists_ThrowsException() {
        // Arrange
        RegisterRequest regReq = new RegisterRequest();
        regReq.setEmail("existing@example.com");
        regReq.setPassword("password123");
        regReq.setDisplayName("Existing User");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> authService.register(regReq));
    }
}