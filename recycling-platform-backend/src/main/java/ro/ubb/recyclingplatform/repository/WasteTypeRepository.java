package ro.ubb.recyclingplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.recyclingplatform.entity.WasteType;

import java.util.Optional;

public interface WasteTypeRepository extends JpaRepository<WasteType, Long> {
    Optional<WasteType> findByName(String name);
}
