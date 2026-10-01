package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.LoginRequest;
import com.glennder.ecommerce.dto.RegisterRequest;
import com.glennder.ecommerce.exception.EmailAlreadyExistsException;
import com.glennder.ecommerce.exception.InvalidCredentialsException;
import com.glennder.ecommerce.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @Test
    void registerShouldRejectDuplicateEmail() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("Password123");

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        assertThrows(
                EmailAlreadyExistsException.class,
                () -> userService.register(request)
        );

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginShouldRejectUnknownEmail() {

        LoginRequest request = new LoginRequest();
        request.setEmail("missing@example.com");
        request.setPassword("Password123");

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        assertThrows(
                InvalidCredentialsException.class,
                () -> userService.login(request)
        );

        verify(jwtService, never()).generateToken(any());
    }
}