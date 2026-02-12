package ro.ubb.recyclingplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.ubb.recyclingplatform.dto.location.LocationRequest;
import ro.ubb.recyclingplatform.entity.RecyclingLocation;
import ro.ubb.recyclingplatform.entity.WasteType;
import ro.ubb.recyclingplatform.repository.LocationRepository;
import ro.ubb.recyclingplatform.repository.WasteTypeRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;
    private final WasteTypeRepository wasteTypeRepository;

    public List<RecyclingLocation> listAll() {
        return locationRepository.findAll();
    }

    public List<RecyclingLocation> search(String wasteType,
                                          Double minLat, Double maxLat,
                                          Double minLng, Double maxLng) {
        String wt = (wasteType == null || wasteType.isBlank())
                ? null
                : wasteType.trim().toUpperCase();
        return locationRepository.search(wt, minLat, maxLat, minLng, maxLng);
    }


    public RecyclingLocation create(LocationRequest req) {
        Set<WasteType> wasteTypes = resolveWasteTypes(req.getAcceptedWasteTypes());

        RecyclingLocation loc = RecyclingLocation.builder()
                .name(req.getName().trim())
                .address(req.getAddress().trim())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .schedule(req.getSchedule())
                .acceptedWasteTypes(wasteTypes)
                .active(true)
                .build();

        return locationRepository.save(loc);
    }

    public RecyclingLocation update(Long id, LocationRequest req) {
        RecyclingLocation loc = locationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));

        loc.setName(req.getName().trim());
        loc.setAddress(req.getAddress().trim());
        loc.setLatitude(req.getLatitude());
        loc.setLongitude(req.getLongitude());
        loc.setSchedule(req.getSchedule());
        loc.setAcceptedWasteTypes(resolveWasteTypes(req.getAcceptedWasteTypes()));

        return locationRepository.save(loc);
    }

    public void delete(Long id) {
        locationRepository.deleteById(id);
    }

    private Set<WasteType> resolveWasteTypes(Set<String> names) {
        Set<WasteType> result = new HashSet<>();
        if (names == null) return result;

        for (String n : names) {
            WasteType wt = wasteTypeRepository.findByName(n.trim().toUpperCase())
                    .orElseThrow(() -> new IllegalArgumentException("Unknown waste type: " + n));
            result.add(wt);
        }
        return result;
    }
}
