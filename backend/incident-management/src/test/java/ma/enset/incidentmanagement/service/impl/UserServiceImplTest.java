package ma.enset.incidentmanagement.service.impl;

import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        // Initialisation avant chaque test
    }

    @Test
    void shouldFindUserByEmail() {

        // Arrange: préparer les données
        String email = "employee@test.com";

        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email))
                .thenReturn(Optional.of(user));

        // Act: exécuter la méthode à tester
        Optional<User> result = userService.findByEmail(email);

        // Assert: vérifier le résultat
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());

        // Verify: vérifier l'appel au repository
        verify(userRepository).findByEmail(email);
    }

    @Test
    void shouldFindUserById() {

        // Arrange: préparer les données
        Long userId = 1L;

        User user = new User();
        user.setId(userId);
        user.setEmail("employee@test.com");

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        // Act: exécuter la méthode
        Optional<User> result = userService.findById(userId);

        // Assert: vérifier le résultat
        assertTrue(result.isPresent());
        assertEquals(userId, result.get().getId());

        // Verify: vérifier l'appel au repository
        verify(userRepository).findById(userId);
    }

    @Test
    void shouldCheckIfEmailExists() {

        // Arrange: préparer les données
        String email = "employee@test.com";

        when(userRepository.existsByEmail(email))
                .thenReturn(true);

        // Act: exécuter la méthode
        boolean result = userService.existsByEmail(email);

        // Assert: vérifier le résultat
        assertTrue(result);

        // Verify: vérifier l'appel au repository
        verify(userRepository).existsByEmail(email);
    }
}
