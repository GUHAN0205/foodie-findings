package com.foodiefindings.config;

import com.foodiefindings.entity.*;
import com.foodiefindings.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final FoodListingRepository foodListingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           FoodListingRepository foodListingRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.foodListingRepository = foodListingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Initializing system administrator and seed demo accounts...");

            // 1. Admin
            User admin = new User(
                    "Foodie Admin",
                    "admin@foodiefindings.org",
                    "+91 98765 43210",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN,
                    12.9716,
                    77.5946,
                    "Foodie Findings HQ, MG Road, Bangalore"
            );
            admin.setVerified(true);
            userRepository.save(admin);

            // 2. Verified NGO
            User ngoUser = new User(
                    "Priya Sharma (Hope Kitchen)",
                    "ngo@hopefoundation.org",
                    "+91 98123 45678",
                    passwordEncoder.encode("ngo123"),
                    Role.NGO,
                    12.9784,
                    77.6408,
                    "Indiranagar, Bangalore"
            );
            ngoUser.setVerified(true);
            User savedNgo = userRepository.save(ngoUser);

            Organization org = new Organization();
            org.setUser(savedNgo);
            org.setOrganizationName("Hope Foundation Community Kitchen");
            org.setOrganizationType("Registered NGO");
            org.setRegistrationNumber("KA-BLR-2021-NGO-4491");
            org.setAddress("14th Main Rd, Indiranagar, Bangalore, Karnataka 560038");
            org.setLatitude(12.9784);
            org.setLongitude(77.6408);
            org.setCapacity(250);
            org.setContactPerson("Priya Sharma");
            org.setContactPhone("+91 98123 45678");
            org.setVerificationStatus(VerificationStatus.VERIFIED);
            organizationRepository.save(org);

            // 3. Donor
            User donor = new User(
                    "Royal Palace Wedding Hall",
                    "donor@foodiefindings.org",
                    "+91 99887 76655",
                    passwordEncoder.encode("donor123"),
                    Role.DONOR,
                    12.9750,
                    77.6050,
                    "Residency Road, Bangalore"
            );
            donor.setVerified(true);
            User savedDonor = userRepository.save(donor);

            // 4. Volunteer
            User volunteer = new User(
                    "Arun Kumar",
                    "volunteer@foodiefindings.org",
                    "+91 97766 55443",
                    passwordEncoder.encode("volunteer123"),
                    Role.VOLUNTEER,
                    12.9698,
                    77.6130,
                    "Brigade Road, Bangalore"
            );
            volunteer.setVerified(true);
            userRepository.save(volunteer);

            // 5. Seed Real-world surplus listings for immediate verification
            LocalDateTime now = LocalDateTime.now();

            FoodListing listing1 = new FoodListing();
            listing1.setDonor(savedDonor);
            listing1.setFoodName("Vegetable Biryani & Mirchi Ka Salan");
            listing1.setDescription("Prepared fresh for an evening wedding banquet. Packed in high-grade insulated thermal containers.");
            listing1.setCategory("Cooked Meals");
            listing1.setQuantity("45 kg (in 3 containers)");
            listing1.setServings(65);
            listing1.setFoodType(FoodType.VEGETARIAN);
            listing1.setPreparedAt(now.minusHours(2));
            listing1.setAvailableFrom(now.minusMinutes(30));
            listing1.setAvailableUntil(now.plusHours(3));
            listing1.setPickupLocation("Royal Palace Banquet Hall, Service Gate 2, Residency Road, Bangalore, 560025");
            listing1.setApproximateArea("Residency Road, Bangalore");
            listing1.setLatitude(12.9750);
            listing1.setLongitude(77.6050);
            listing1.setImageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80");
            listing1.setStorageCondition("Hot insulated food containers");
            listing1.setAllergens("Contains dairy, cashews");
            listing1.setSpecialInstructions("Please enter via Gate 2 security counter. Ask for banquet manager Rajesh.");
            listing1.setEventType("Wedding");
            listing1.setStatus(ListingStatus.AVAILABLE);
            foodListingRepository.save(listing1);

            FoodListing listing2 = new FoodListing();
            listing2.setDonor(savedDonor);
            listing2.setFoodName("Assorted Artisan Breads & Croissants");
            listing2.setDescription("Surplus fresh baked morning goods from corporate catering event. Untouched and individually boxed.");
            listing2.setCategory("Bakery & Breads");
            listing2.setQuantity("4 large crates (80 pieces)");
            listing2.setServings(40);
            listing2.setFoodType(FoodType.VEGETARIAN);
            listing2.setPreparedAt(now.minusHours(4));
            listing2.setAvailableFrom(now.minusHours(1));
            listing2.setAvailableUntil(now.plusMinutes(75)); // Expiring soon!
            listing2.setPickupLocation("Corporate Tech Park, Block C Cafeteria, Old Airport Road, Bangalore");
            listing2.setApproximateArea("Old Airport Road, Bangalore");
            listing2.setLatitude(12.9592);
            listing2.setLongitude(77.6475);
            listing2.setImageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80");
            listing2.setStorageCondition("Dry ambient temperature, sealed bakery cartons");
            listing2.setAllergens("Contains gluten, milk");
            listing2.setSpecialInstructions("Collect from Cafeteria loading bay before 8:00 PM.");
            listing2.setEventType("Corporate Event");
            listing2.setStatus(ListingStatus.EXPIRING_SOON);
            foodListingRepository.save(listing2);

            logger.info("Foodie Findings bootstrap data initialized successfully.");
        }
    }
}
