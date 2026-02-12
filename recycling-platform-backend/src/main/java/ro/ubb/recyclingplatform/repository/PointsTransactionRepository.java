package ro.ubb.recyclingplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.recyclingplatform.entity.PointsTransaction;
import ro.ubb.recyclingplatform.entity.User;

import java.util.List;

public interface PointsTransactionRepository extends JpaRepository<PointsTransaction, Long> {
    List<PointsTransaction> findByUserOrderByCreatedAtDesc(User user);
}
