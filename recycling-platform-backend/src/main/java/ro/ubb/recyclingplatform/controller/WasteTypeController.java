package ro.ubb.recyclingplatform.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.location.WasteTypeResponse;
import ro.ubb.recyclingplatform.repository.WasteTypeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/waste-types")
@RequiredArgsConstructor
public class WasteTypeController {

    private final WasteTypeRepository wasteTypeRepository;

    @GetMapping
    public List<WasteTypeResponse> list() {
        return wasteTypeRepository.findAll().stream()
                .map(wt -> WasteTypeResponse.builder()
                        .id(wt.getId())
                        .name(wt.getName())
                        .build())
                .toList();
    }
}
