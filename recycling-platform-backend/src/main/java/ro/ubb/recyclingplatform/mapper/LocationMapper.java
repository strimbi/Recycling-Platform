package ro.ubb.recyclingplatform.mapper;

import ro.ubb.recyclingplatform.dto.location.LocationResponse;
import ro.ubb.recyclingplatform.entity.RecyclingLocation;
import ro.ubb.recyclingplatform.entity.WasteType;

import java.util.stream.Collectors;

public class LocationMapper {
    public static LocationResponse toResponse(RecyclingLocation loc) {
        return LocationResponse.builder()
                .id(loc.getId())
                .name(loc.getName())
                .address(loc.getAddress())
                .latitude(loc.getLatitude())
                .longitude(loc.getLongitude())
                .schedule(loc.getSchedule())
                .active(loc.isActive())
                .acceptedWasteTypes(
                        loc.getAcceptedWasteTypes().stream()
                                .map(WasteType::getName)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}
