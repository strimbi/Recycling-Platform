package ro.ubb.recyclingplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import ro.ubb.recyclingplatform.entity.enums.ReportStatus;
import ro.ubb.recyclingplatform.entity.enums.ReportType;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "reports")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private ReportType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ReportStatus status;

    @Column(nullable = false, length = 500)
    private String description;

    // For reports tied to an existing location (nullable for NEW_LOCATION proposals)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private RecyclingLocation location;

    // Proposal fields for NEW_LOCATION
    private Double proposedLat;
    private Double proposedLng;

    @Column(length = 200)
    private String proposedAddress;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @Column(length = 300)
    private String adminComment;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant resolvedAt;

    @ElementCollection
    @CollectionTable(name = "report_proposed_waste_types", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "waste_type", nullable = false, length = 40)
    @Builder.Default
    private Set<String> proposedWasteTypes = new HashSet<>();
}
