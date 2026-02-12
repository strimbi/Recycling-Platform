package ro.ubb.recyclingplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import ro.ubb.recyclingplatform.entity.enums.Role;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 80)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Role role;

    @Column(nullable = false)
    private long points;

    @Column(nullable = false)
    private Instant createdAt;
}
