package ma.enset.incidentmanagement.service;

import ma.enset.incidentmanagement.dto.response.AuthResponse;
import ma.enset.incidentmanagement.dto.request.LoginRequest;
import ma.enset.incidentmanagement.dto.request.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
