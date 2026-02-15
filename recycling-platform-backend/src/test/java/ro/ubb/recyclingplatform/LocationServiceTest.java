package ro.ubb.recyclingplatform;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.ubb.recyclingplatform.dto.location.LocationRequest;
import ro.ubb.recyclingplatform.repository.LocationRepository;
import ro.ubb.recyclingplatform.repository.WasteTypeRepository;
import ro.ubb.recyclingplatform.service.LocationService;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {

    @Mock private LocationRepository locationRepository;
    @Mock private WasteTypeRepository wasteTypeRepository;
    @InjectMocks private LocationService locationService;

    @Test
    void create_ShouldThrowException_WhenWasteTypeUnknown() {
        // Arrange
        LocationRequest req = new LocationRequest();
        req.setName("Centru");
        req.setAddress("Strada 1");
        req.setAcceptedWasteTypes(Set.of("PLASTIC_INVALID"));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> locationService.create(req));
    }
}