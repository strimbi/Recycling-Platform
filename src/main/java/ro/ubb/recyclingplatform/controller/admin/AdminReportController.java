package ro.ubb.recyclingplatform.controller.admin;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.ubb.recyclingplatform.dto.report.ReportResponse;
import ro.ubb.recyclingplatform.mapper.ReportMapper;
import ro.ubb.recyclingplatform.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final AdminService adminService;

    @GetMapping
    public List<ReportResponse> list(@RequestParam(required = false) String status) {
        return adminService.listReportsByStatus(status).stream()
                .map(ReportMapper::toResponse)
                .toList();
    }

    @PostMapping("/{id}/approve")
    public ReportResponse approve(@PathVariable Long id, @RequestBody ApproveRequest req) {
        return ReportMapper.toResponse(adminService.approveReport(id, req.points, req.adminComment));
    }


    @PostMapping("/{id}/reject")
    public ReportResponse reject(@PathVariable Long id, @RequestBody RejectRequest req) {
        return ReportMapper.toResponse(adminService.rejectReport(id, req.adminComment));
    }

    @Data
    public static class ApproveRequest {
        public Long points;
        public String adminComment;
    }

    @Data
    public static class RejectRequest {
        public String adminComment;
    }
}
