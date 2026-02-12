package ro.ubb.recyclingplatform.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Recycling Platform API")
                        .version("1.0")
                        .description("Platforma de reciclare: harta, raportari, roluri, puncte/leaderboard"));
    }
}
