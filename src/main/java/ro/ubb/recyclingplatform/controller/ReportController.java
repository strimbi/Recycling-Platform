package ro.ubb.recyclingplatform.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.report.*;
import ro.ubb.recyclingplatform.mapper.ReportMapper;
import ro.ubb.recyclingplatform.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ReportResponse create(Authentication auth, @Valid @RequestBody CreateReportRequest req) {
        return ReportMapper.toResponse(reportService.createReport(auth.getName(), req));
    }

    @GetMapping("/mine")
    public List<ReportResponse> mine(Authentication auth) {
        return reportService.listMine(auth.getName()).stream()
                .map(ReportMapper::toResponse)
                .toList();
    }
}
