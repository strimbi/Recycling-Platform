package ro.ubb.recyclingplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.recyclingplatform.entity.Report;
import ro.ubb.recyclingplatform.entity.User;
import ro.ubb.recyclingplatform.entity.enums.ReportStatus;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByCreatedByOrderByCreatedAtDesc(User user);
    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);
}
