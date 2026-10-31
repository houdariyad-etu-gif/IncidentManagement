package ma.enset.incidentmanagement.dto.response;

public record AuthResponse(
        String token,
        String role,
        String fullName
) {}
