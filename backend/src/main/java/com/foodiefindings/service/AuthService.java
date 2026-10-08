package com.foodiefindings.service;

import com.foodiefindings.dto.AuthRequest;
import com.foodiefindings.dto.AuthResponse;
import com.foodiefindings.dto.RegisterRequest;
import com.foodiefindings.entity.*;
import com.foodiefindings.exception.BadRequestException;
import com.foodiefindings.exception.ResourceNotFoundException;
import com.foodiefindings.repository.OrganizationRepository;
import com.foodiefindings.repository.UserRepository;
import com.foodiefindings.security.JwtTokenProvider;
import com.foodiefindings.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        // Rule: Admin must never be publicly selectable
        Role selectedRole = request.getRole();
        if (selectedRole == Role.ADMIN) {
            throw new BadRequestException("Administrator registration is restricted");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(selectedRole);
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        user.setLocation(request.getLocation());

        // Donors and volunteers are verified immediately. NGOs require document verification.
        if (selectedRole == Role.NGO) {
            user.setVerified(false);
        } else {
            user.setVerified(true);
        }

        User savedUser = userRepository.save(user);

        // If registering as NGO, create associated Organization profile
        if (selectedRole == Role.NGO) {
            Organization org = new Organization();
            org.setUser(savedUser);
            org.setOrganizationName(request.getOrganizationName() != null && !request.getOrganizationName().isBlank()
                    ? request.getOrganizationName() : request.getName());
            org.setOrganizationType(request.getOrganizationType() != null && !request.getOrganizationType().isBlank()
                    ? request.getOrganizationType() : "NGO");
            org.setRegistrationNumber(request.getRegistrationNumber());
            org.setAddress(request.getLocation() != null ? request.getLocation() : "Address pending update");
            org.setLatitude(request.getLatitude());
            org.setLongitude(request.getLongitude());
            org.setCapacity(request.getCapacity() != null ? request.getCapacity() : 100);
            org.setContactPerson(request.getName());
            org.setContactPhone(request.getPhone());
            org.setVerificationStatus(VerificationStatus.PENDING);
            organizationRepository.save(org);
        }

        // Generate JWT
        String token = tokenProvider.generateTokenFromUser(
                savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name(), savedUser.getName()
        );

        // Send welcome notification
        notificationService.createNotification(
                savedUser,
                "Welcome to Foodie Findings! 🍱",
                "Thank you for joining our mission. Good food should find a good home.",
                NotificationType.SYSTEM
        );

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getLatitude(),
                savedUser.getLongitude(),
                savedUser.getLocation(),
                savedUser.getVerified()
        );
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLatitude(),
                user.getLongitude(),
                user.getLocation(),
                user.getVerified()
        );
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        return userRepository.findById(principal.getId()).orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
