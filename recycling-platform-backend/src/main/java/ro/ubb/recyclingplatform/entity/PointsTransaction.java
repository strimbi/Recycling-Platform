package ro.ubb.recyclingplatform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "points_transactions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PointsTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(nullable = false)
    private long points;

    @Column(nullable = false)
    private Instant createdAt;
}
