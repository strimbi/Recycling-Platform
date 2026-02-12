package ro.ubb.recyclingplatform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "recycling_locations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class RecyclingLocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(length = 300)
    private String schedule;

    @ManyToMany
    @JoinTable(
            name = "location_waste_types",
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "waste_type_id")
    )
    @Builder.Default
    private Set<WasteType> acceptedWasteTypes = new HashSet<>();

    @Column(nullable = false)
    private boolean active = true;
}
