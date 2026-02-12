package ro.ubb.recyclingplatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "waste_types")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WasteType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String name;
}
