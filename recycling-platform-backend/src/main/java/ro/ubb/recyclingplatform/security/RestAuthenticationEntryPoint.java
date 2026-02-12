package ro.ubb.recyclingplatform.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import ro.ubb.recyclingplatform.exception.ErrorResponse;

import java.io.IOException;
import java.time.Instant;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        ErrorResponse body = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(401)
                .error("Unauthorized")
                .message("Authentication required")
                .path(request.getRequestURI())
                .build();

        response.setStatus(401);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        mapper.writeValue(response.getOutputStream(), body);
    }
}
