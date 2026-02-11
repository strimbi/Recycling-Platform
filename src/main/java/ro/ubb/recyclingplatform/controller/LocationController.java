package ro.ubb.recyclingplatform.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.location.LocationResponse;
import ro.ubb.recyclingplatform.mapper.LocationMapper;
import ro.ubb.recyclingplatform.service.LocationService;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public List<LocationResponse> list(
            @RequestParam(required = false) String wasteType,
            @RequestParam(required = false) Double minLat,
            @RequestParam(required = false) Double maxLat,
            @RequestParam(required = false) Double minLng,
            @RequestParam(required = false) Double maxLng
    ) {
        return locationService.search(wasteType, minLat, maxLat, minLng, maxLng).stream()
                .map(LocationMapper::toResponse)
                .toList();
    }
}
