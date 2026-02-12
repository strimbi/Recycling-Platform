package ro.ubb.recyclingplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import java.util.List;
import ro.ubb.recyclingplatform.repository.WasteTypeRepository;
import ro.ubb.recyclingplatform.entity.WasteType;

@SpringBootApplication
public class RecyclingPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecyclingPlatformApplication.class, args);
    }

    @Bean
    CommandLineRunner seedWasteTypes(WasteTypeRepository wasteTypeRepository) {
        return args -> {
            List<String> defaults = List.of("PLASTIC", "GLASS", "PAPER", "BATTERIES", "E_WASTE", "TEXTILES", "OIL");
            for (String name : defaults) {
                wasteTypeRepository.findByName(name).orElseGet(() -> wasteTypeRepository.save(
                        WasteType.builder().name(name).build()
                ));
            }
        };
    }
}
