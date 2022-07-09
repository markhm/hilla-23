package dk.mhm.hilla.data.service;

import dk.mhm.hilla.data.entity.User;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface UserRepository extends JpaRepository<User, UUID> {

    User findByUsername(String username);
}
