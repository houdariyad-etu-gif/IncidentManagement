package ma.enset.incidentmanagement.service;

import ma.enset.incidentmanagement.entity.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    boolean existsByEmail(String email);
}