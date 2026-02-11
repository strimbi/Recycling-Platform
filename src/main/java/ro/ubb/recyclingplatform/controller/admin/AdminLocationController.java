package ro.ubb.recyclingplatform.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.location.LocationRequest;
import ro.ubb.recyclingplatform.dto.location.LocationResponse;
import ro.ubb.recyclingplatform.mapper.LocationMapper;
import ro.ubb.recyclingplatform.service.LocationService;

@RestController
@RequestMapping("/api/admin/locations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLocationController {

    private final LocationService locationService;

    @PostMapping
    public LocationResponse create(@Valid @RequestBody LocationRequest req) {
        return LocationMapper.toResponse(locationService.create(req));
    }

    @PutMapping("/{id}")
    public LocationResponse update(@PathVariable Long id, @Valid @RequestBody LocationRequest req) {
        return LocationMapper.toResponse(locationService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        locationService.delete(id);
    }
}
