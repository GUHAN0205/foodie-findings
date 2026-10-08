package com.foodiefindings.dto;

import com.foodiefindings.entity.Role;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Double latitude;
    private Double longitude;
    private String location;
    private Boolean verified;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String name, String email, Role role,
                        Double latitude, Double longitude, String location, Boolean verified) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.latitude = latitude;
        this.longitude = longitude;
        this.location = location;
        this.verified = verified;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
