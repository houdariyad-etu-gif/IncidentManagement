package ma.enset.incidentmanagement.config;

import ma.enset.incidentmanagement.entity.User;
import ma.enset.incidentmanagement.enums.Role;
import ma.enset.incidentmanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            if (!userRepository.existsByEmail("admin@test.com")) {
                User admin = new User();
                admin.setFullName("Admin A");
                admin.setEmail("admin@test.com");
                admin.setPassword(passwordEncoder.encode("Admin123!"));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);

                userRepository.save(admin);
            }
        };
    }
}