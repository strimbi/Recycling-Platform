package ro.ubb.recyclingplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.recyclingplatform.entity.RecyclingLocation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationRepository extends JpaRepository<RecyclingLocation, Long> {
    @Query("""
        SELECT DISTINCT l
        FROM RecyclingLocation l
        LEFT JOIN l.acceptedWasteTypes wt
        WHERE l.active = true
          AND (:wasteType IS NULL OR wt.name = :wasteType)
          AND (:minLat IS NULL OR l.latitude >= :minLat)
          AND (:maxLat IS NULL OR l.latitude <= :maxLat)
          AND (:minLng IS NULL OR l.longitude >= :minLng)
          AND (:maxLng IS NULL OR l.longitude <= :maxLng)
        """)
    List<RecyclingLocation> search(
            @Param("wasteType") String wasteType,
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLng") Double minLng,
            @Param("maxLng") Double maxLng
    );
}
