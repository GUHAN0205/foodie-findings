package com.foodiefindings.backend.dto;

import com.foodiefindings.backend.model.Role;
import com.foodiefindings.backend.model.User;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private boolean verified;

    public UserDto() {}

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.latitude = user.getLatitude();
        this.longitude = user.getLongitude();
        this.locationName = user.getLocationName();
        this.verified = user.isVerified();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
