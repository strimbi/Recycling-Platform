package ro.ubb.recyclingplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.recyclingplatform.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
