package ro.ubb.recyclingplatform;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import ro.ubb.recyclingplatform.controller.AuthController;
import ro.ubb.recyclingplatform.dto.auth.LoginRequest;
import ro.ubb.recyclingplatform.dto.auth.RegisterRequest;
import ro.ubb.recyclingplatform.repository.WasteTypeRepository;
import ro.ubb.recyclingplatform.security.CustomUserDetailsService;
import ro.ubb.recyclingplatform.security.JwtService;
import ro.ubb.recyclingplatform.service.AuthService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private WasteTypeRepository wasteTypeRepository;

    @Test
    @DisplayName("Login - 400 Bad Request pentru email invalid")
    void login_ShouldReturnBadRequest_WhenEmailIsInvalid() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("email_incorect");
        req.setPassword("parola123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Register - 400 Bad Request parola e prea scurta")
    void register_ShouldReturnBadRequest_WhenPasswordIsTooShort() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("123");
        req.setDisplayName("User Test");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Login - 200 OK datele sunt valide")
    void login_ShouldReturnOk_WhenDataIsValid() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("parola_valida");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}