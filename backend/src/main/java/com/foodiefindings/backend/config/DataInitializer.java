package com.foodiefindings.backend.config;

import com.foodiefindings.backend.model.*;
import com.foodiefindings.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FoodListingRepository foodListingRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final DonationRepository donationRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           FoodListingRepository foodListingRepository,
                           PickupRequestRepository pickupRequestRepository,
                           DonationRepository donationRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.foodListingRepository = foodListingRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.donationRepository = donationRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            initializeBaseData();
        }
        ensureIndiaData();
    }

    private void initializeBaseData() {
        System.out.println(">>> Initializing Foodie Findings base sample data...");

        // 1. Create Users
        User donor1 = new User("Harvest Hearth Bakery", "donor@foodie.org", "+1 (415) 555-0101",
                passwordEncoder.encode("password123"), Role.ROLE_DONOR);
        donor1.setLatitude(37.7749);
        donor1.setLongitude(-122.4194);
        donor1.setLocationName("Mission District, SF");
        donor1.setVerified(true);

        User donor2 = new User("Green Garden Bistro", "bistro@foodie.org", "+1 (415) 555-0102",
                passwordEncoder.encode("password123"), Role.ROLE_DONOR);
        donor2.setLatitude(37.7833);
        donor2.setLongitude(-122.4167);
        donor2.setLocationName("SoMa Downtown, SF");
        donor2.setVerified(true);

        User donor3 = new User("Fresh Fields Organic Grocery", "grocery@foodie.org", "+1 (415) 555-0103",
                passwordEncoder.encode("password123"), Role.ROLE_DONOR);
        donor3.setLatitude(37.7699);
        donor3.setLongitude(-122.4469);
        donor3.setLocationName("Haight-Ashbury, SF");
        donor3.setVerified(true);

        User donor4 = new User("Pacific Grand Catering", "banquet@foodie.org", "+1 (415) 555-0104",
                passwordEncoder.encode("password123"), Role.ROLE_DONOR);
        donor4.setLatitude(37.7952);
        donor4.setLongitude(-122.3999);
        donor4.setLocationName("Embarcadero, SF");
        donor4.setVerified(true);

        User volunteer = new User("Alex Rivera (Courier)", "volunteer@foodie.org", "+1 (415) 555-0201",
                passwordEncoder.encode("password123"), Role.ROLE_VOLUNTEER);
        volunteer.setLatitude(37.7785);
        volunteer.setLongitude(-122.4150);
        volunteer.setLocationName("Hayes Valley, SF");
        volunteer.setVerified(true);

        User ngo = new User("Hope Harbor Food Bank", "ngo@foodie.org", "+1 (415) 555-0301",
                passwordEncoder.encode("password123"), Role.ROLE_NGO);
        ngo.setLatitude(37.7600);
        ngo.setLongitude(-122.4180);
        ngo.setLocationName("Mission Center, SF");
        ngo.setVerified(true);

        User admin = new User("Admin Support", "admin@foodie.org", "+1 (415) 555-0999",
                passwordEncoder.encode("password123"), Role.ROLE_ADMIN);
        admin.setLatitude(37.7749);
        admin.setLongitude(-122.4194);
        admin.setLocationName("Platform HQ, SF");
        admin.setVerified(true);

        userRepository.saveAll(List.of(donor1, donor2, donor3, donor4, volunteer, ngo, admin));

        // 2. Active Food Listings
        LocalDateTime now = LocalDateTime.now();

        FoodListing listing1 = new FoodListing();
        listing1.setDonor(donor1);
        listing1.setFoodName("Artisan Sourdough Loaves & Morning Pastries");
        listing1.setDescription("Freshly baked this morning. Sourdough boules, multigrain baguettes, and assorted almond and butter croissants.");
        listing1.setCategory("Bakery");
        listing1.setQuantity("18 loaves & 24 croissants");
        listing1.setServings(45);
        listing1.setFoodType(FoodType.VEGETARIAN);
        listing1.setEventType("Daily Bakery Surplus");
        listing1.setStorageCondition("Room temperature, dry ambient");
        listing1.setAllergens("Gluten, Dairy");
        listing1.setSpecialInstructions("Packaged in sanitized baker trays. Loading ramp accessible from rear alley.");
        listing1.setPreparedAt(now.minusHours(4));
        listing1.setAvailableFrom(now.minusMinutes(30));
        listing1.setAvailableUntil(now.plusHours(5));
        listing1.setPickupLocation("742 Valencia St, San Francisco, CA 94110");
        listing1.setApproximateArea("Mission District (~0.8 km)");
        listing1.setLatitude(37.7599);
        listing1.setLongitude(-122.4214);
        listing1.setImageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80");
        listing1.setStatus(FoodStatus.AVAILABLE);

        FoodListing listing2 = new FoodListing();
        listing2.setDonor(donor2);
        listing2.setFoodName("Mediterranean Roasted Veggie & Quinoa Bowls");
        listing2.setDescription("Warm roasted zucchini, bell peppers, chickpeas, and lemon-herb quinoa bowls. High nutrient, chef-prepared.");
        listing2.setCategory("Cooked Meals");
        listing2.setQuantity("12 deep catering containers");
        listing2.setServings(60);
        listing2.setFoodType(FoodType.VEGAN);
        listing2.setEventType("Corporate Luncheon");
        listing2.setStorageCondition("Keep hot (>60°C) or refrigerate upon arrival");
        listing2.setAllergens("None");
        listing2.setSpecialInstructions("Safely insulated in thermal cambros. Please bring insulated bag or boxes.");
        listing2.setPreparedAt(now.minusHours(2));
        listing2.setAvailableFrom(now);
        listing2.setAvailableUntil(now.plusHours(3));
        listing2.setPickupLocation("450 Howard St, San Francisco, CA 94105");
        listing2.setApproximateArea("SoMa Tech Hub (~1.4 km)");
        listing2.setLatitude(37.7880);
        listing2.setLongitude(-122.3990);
        listing2.setImageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80");
        listing2.setStatus(FoodStatus.AVAILABLE);

        FoodListing listing3 = new FoodListing();
        listing3.setDonor(donor3);
        listing3.setFoodName("Seasonal Organic Fruit Crates (Apples & Berries)");
        listing3.setDescription("Crisp Honeycrisp apples, ripe blueberries, and sweet navel oranges. Perfectly fresh and ready to eat.");
        listing3.setCategory("Fresh Produce");
        listing3.setQuantity("6 wooden crates (~32 kg)");
        listing3.setServings(75);
        listing3.setFoodType(FoodType.VEGAN);
        listing3.setEventType("Grocery Morning Restock");
        listing3.setStorageCondition("Cool ambient or refrigerated");
        listing3.setAllergens("None");
        listing3.setSpecialInstructions("Direct street loading parking available right outside store.");
        listing3.setPreparedAt(now.minusHours(6));
        listing3.setAvailableFrom(now.minusHours(1));
        listing3.setAvailableUntil(now.plusHours(8));
        listing3.setPickupLocation("1620 Haight St, San Francisco, CA 94117");
        listing3.setApproximateArea("Haight-Ashbury (~2.1 km)");
        listing3.setLatitude(37.7699);
        listing3.setLongitude(-122.4469);
        listing3.setImageUrl("https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80");
        listing3.setStatus(FoodStatus.AVAILABLE);

        FoodListing listing4 = new FoodListing();
        listing4.setDonor(donor4);
        listing4.setFoodName("Gourmet Pasta Primavera & Herb Baguettes");
        listing4.setDescription("Tender penne pasta tossed with farm-fresh asparagus, cherry tomatoes, basil pesto, and grated parmesan.");
        listing4.setCategory("Cooked Meals");
        listing4.setQuantity("8 deep chafing trays");
        listing4.setServings(40);
        listing4.setFoodType(FoodType.VEGETARIAN);
        listing4.setEventType("Private Banquet");
        listing4.setStorageCondition("Refrigerated (under 4°C)");
        listing4.setAllergens("Dairy, Gluten, Pine Nuts");
        listing4.setSpecialInstructions("Rapidly chilled in commercial blast chiller per food safety code.");
        listing4.setPreparedAt(now.minusHours(3));
        listing4.setAvailableFrom(now);
        listing4.setAvailableUntil(now.plusHours(2)); // Expiring soon
        listing4.setPickupLocation("1 Market St, San Francisco, CA 94105");
        listing4.setApproximateArea("Embarcadero (~1.8 km)");
        listing4.setLatitude(37.7940);
        listing4.setLongitude(-122.3950);
        listing4.setImageUrl("https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80");
        listing4.setStatus(FoodStatus.AVAILABLE);

        FoodListing listing5 = new FoodListing();
        listing5.setDonor(donor2);
        listing5.setFoodName("Artisan Deli Wraps & Ciabatta Sandwiches");
        listing5.setDescription("Individual wrapped turkey-avocado, roasted chicken pesto, and caprese ciabatta sandwiches.");
        listing5.setCategory("Packaged");
        listing5.setQuantity("35 individually sealed boxes");
        listing5.setServings(35);
        listing5.setFoodType(FoodType.NON_VEGETARIAN);
        listing5.setEventType("Conference Workshop");
        listing5.setStorageCondition("Refrigerated");
        listing5.setAllergens("Gluten, Dairy, Poultry");
        listing5.setSpecialInstructions("Each box clearly labeled with dietary tags.");
        listing5.setPreparedAt(now.minusHours(2));
        listing5.setAvailableFrom(now);
        listing5.setAvailableUntil(now.plusHours(4));
        listing5.setPickupLocation("450 Howard St, San Francisco, CA 94105");
        listing5.setApproximateArea("SoMa Downtown (~1.4 km)");
        listing5.setLatitude(37.7880);
        listing5.setLongitude(-122.3990);
        listing5.setImageUrl("https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80");
        listing5.setStatus(FoodStatus.AVAILABLE);

        foodListingRepository.saveAll(List.of(listing1, listing2, listing3, listing4, listing5));

        // 3. Past Completed Rescues / Donations for Initial Impact Metrics
        FoodListing pastListing1 = new FoodListing();
        pastListing1.setDonor(donor1);
        pastListing1.setFoodName("Rustic Loaves & Bagels");
        pastListing1.setCategory("Bakery");
        pastListing1.setQuantity("50 loaves");
        pastListing1.setServings(120);
        pastListing1.setFoodType(FoodType.VEGETARIAN);
        pastListing1.setPickupLocation("742 Valencia St, SF");
        pastListing1.setApproximateArea("Mission District");
        pastListing1.setLatitude(37.7599);
        pastListing1.setLongitude(-122.4214);
        pastListing1.setAvailableFrom(now.minusDays(3));
        pastListing1.setAvailableUntil(now.minusDays(3).plusHours(4));
        pastListing1.setStatus(FoodStatus.COLLECTED);
        foodListingRepository.save(pastListing1);

        Donation donation1 = new Donation();
        donation1.setFoodListing(pastListing1);
        donation1.setDonor(donor1);
        donation1.setRecipient(ngo);
        donation1.setVolunteer(volunteer);
        donation1.setQuantity("50 loaves");
        donation1.setServings(120);
        donation1.setImpactWeightKg(48.0);
        donation1.setStatus("COMPLETED");
        donation1.setCompletedAt(now.minusDays(3));
        donationRepository.save(donation1);

        FoodListing pastListing2 = new FoodListing();
        pastListing2.setDonor(donor4);
        pastListing2.setFoodName("Buffet Roast Vegetables & Herb Rice");
        pastListing2.setCategory("Cooked Meals");
        pastListing2.setQuantity("20 hotel pans");
        pastListing2.setServings(250);
        pastListing2.setFoodType(FoodType.VEGETARIAN);
        pastListing2.setPickupLocation("1 Market St, SF");
        pastListing2.setApproximateArea("Embarcadero");
        pastListing2.setLatitude(37.7940);
        pastListing2.setLongitude(-122.3950);
        pastListing2.setAvailableFrom(now.minusDays(2));
        pastListing2.setAvailableUntil(now.minusDays(2).plusHours(5));
        pastListing2.setStatus(FoodStatus.COLLECTED);
        foodListingRepository.save(pastListing2);

        Donation donation2 = new Donation();
        donation2.setFoodListing(pastListing2);
        donation2.setDonor(donor4);
        donation2.setRecipient(ngo);
        donation2.setVolunteer(volunteer);
        donation2.setQuantity("20 hotel pans");
        donation2.setServings(250);
        donation2.setImpactWeightKg(100.0);
        donation2.setStatus("COMPLETED");
        donation2.setCompletedAt(now.minusDays(2));
        donationRepository.save(donation2);

        FoodListing pastListing3 = new FoodListing();
        pastListing3.setDonor(donor3);
        pastListing3.setFoodName("Organic Bananas, Apples & Greens");
        pastListing3.setCategory("Fresh Produce");
        pastListing3.setQuantity("12 crates");
        pastListing3.setServings(180);
        pastListing3.setFoodType(FoodType.VEGAN);
        pastListing3.setPickupLocation("1620 Haight St, SF");
        pastListing3.setApproximateArea("Haight-Ashbury");
        pastListing3.setLatitude(37.7699);
        pastListing3.setLongitude(-122.4469);
        pastListing3.setAvailableFrom(now.minusDays(1));
        pastListing3.setAvailableUntil(now.minusDays(1).plusHours(6));
        pastListing3.setStatus(FoodStatus.COLLECTED);
        foodListingRepository.save(pastListing3);

        Donation donation3 = new Donation();
        donation3.setFoodListing(pastListing3);
        donation3.setDonor(donor3);
        donation3.setRecipient(ngo);
        donation3.setVolunteer(volunteer);
        donation3.setQuantity("12 crates");
        donation3.setServings(180);
        donation3.setImpactWeightKg(72.0);
        donation3.setStatus("COMPLETED");
        donation3.setCompletedAt(now.minusDays(1));
        donationRepository.save(donation3);

        // 4. Sample active Pickup Request in progress
        PickupRequest samplePickup = new PickupRequest();
        samplePickup.setFoodListing(listing1);
        samplePickup.setRequester(volunteer);
        samplePickup.setStatus(PickupStatus.ACCEPTED);
        samplePickup.setVehicleType("Cargo Bike");
        samplePickup.setEstimatedArrivalMinutes(25);
        samplePickup.setNotes("Bringing 2 insulated food delivery bags. Arriving around 2:30 PM.");
        samplePickup.setRequestedAt(now.minusMinutes(45));
        samplePickup.setAcceptedAt(now.minusMinutes(30));
        pickupRequestRepository.save(samplePickup);

        // 5. Welcome notifications
        Notification notif1 = new Notification(
                donor1,
                "Pickup Request Accepted",
                "Alex Rivera (Courier) has scheduled a pickup for \"Artisan Sourdough Loaves\".",
                NotificationType.PICKUP_UPDATE,
                "/pickups"
        );
        Notification notif2 = new Notification(
                volunteer,
                "Welcome to Foodie Findings!",
                "You're registered as a rescue volunteer. Explore surplus food near you and claim a rescue mission!",
                NotificationType.INFO,
                "/feed"
        );
        notificationRepository.saveAll(List.of(notif1, notif2));

        System.out.println(">>> Foodie Findings sample data initialized successfully!");
    }

    private void ensureIndiaData() {
        boolean hasIndia = foodListingRepository.findAll().stream().anyMatch(l ->
                l.getLatitude() != null && l.getLatitude() >= 8.0 && l.getLatitude() <= 37.0 &&
                l.getLongitude() != null && l.getLongitude() >= 68.0 && l.getLongitude() <= 97.0
        );

        if (hasIndia) {
            return;
        }

        System.out.println(">>> Seeding Indian surplus food listings (Delhi, Mumbai, Bengaluru, Hyderabad, Pune)...");

        // Indian Donors
        User donorDelhi = userRepository.findByEmail("delhi.donor@foodie.org").orElseGet(() -> {
            User u = new User("Annapurna Rasoi & Banquets", "delhi.donor@foodie.org", "+91 98110 23456",
                    passwordEncoder.encode("password123"), Role.ROLE_DONOR);
            u.setLatitude(28.6304);
            u.setLongitude(77.2177);
            u.setLocationName("Connaught Place, New Delhi");
            u.setVerified(true);
            return userRepository.save(u);
        });

        User donorDelhi2 = userRepository.findByEmail("karolbagh.donor@foodie.org").orElseGet(() -> {
            User u = new User("Punjab Sweets & Caterers", "karolbagh.donor@foodie.org", "+91 98111 87654",
                    passwordEncoder.encode("password123"), Role.ROLE_DONOR);
            u.setLatitude(28.6517);
            u.setLongitude(77.1906);
            u.setLocationName("Karol Bagh, New Delhi");
            u.setVerified(true);
            return userRepository.save(u);
        });

        User donorMumbai = userRepository.findByEmail("mumbai.donor@foodie.org").orElseGet(() -> {
            User u = new User("Shree Krishna Grand Banquets", "mumbai.donor@foodie.org", "+91 98200 12345",
                    passwordEncoder.encode("password123"), Role.ROLE_DONOR);
            u.setLatitude(19.0596);
            u.setLongitude(72.8295);
            u.setLocationName("Bandra West, Mumbai");
            u.setVerified(true);
            return userRepository.save(u);
        });

        User donorBlr = userRepository.findByEmail("bengaluru.donor@foodie.org").orElseGet(() -> {
            User u = new User("Udipi Heritage Grand", "bengaluru.donor@foodie.org", "+91 98450 67890",
                    passwordEncoder.encode("password123"), Role.ROLE_DONOR);
            u.setLatitude(12.9352);
            u.setLongitude(77.6245);
            u.setLocationName("Koramangala, Bengaluru");
            u.setVerified(true);
            return userRepository.save(u);
        });

        User donorHyd = userRepository.findByEmail("hyderabad.donor@foodie.org").orElseGet(() -> {
            User u = new User("Nizam Heritage Kitchen", "hyderabad.donor@foodie.org", "+91 98660 34567",
                    passwordEncoder.encode("password123"), Role.ROLE_DONOR);
            u.setLatitude(17.4156);
            u.setLongitude(78.4357);
            u.setLocationName("Banjara Hills, Hyderabad");
            u.setVerified(true);
            return userRepository.save(u);
        });

        User donorPune = userRepository.findByEmail("pune.donor@foodie.org").orElseGet(() -> {
            User u = new User("Deccan Spice Caterers", "pune.donor@foodie.org", "+91 98220 45678",
                    passwordEncoder.encode("password123"), Role.ROLE_DONOR);
            u.setLatitude(18.5308);
            u.setLongitude(73.8475);
            u.setLocationName("Shivaji Nagar, Pune");
            u.setVerified(true);
            return userRepository.save(u);
        });

        LocalDateTime now = LocalDateTime.now();

        FoodListing in1 = new FoodListing();
        in1.setDonor(donorDelhi);
        in1.setFoodName("Dal Makhani, Shahi Paneer & 85 Fresh Tawa Rotis");
        in1.setDescription("Freshly prepared wedding reception surplus. Rich creamy black dal, paneer in tomato-cashew gravy, and warm tiffin-packed rotis.");
        in1.setCategory("Cooked Meals");
        in1.setQuantity("6 large thermal vessels (~35 kg)");
        in1.setServings(65);
        in1.setFoodType(FoodType.VEGETARIAN);
        in1.setEventType("Wedding Reception Banquet");
        in1.setStorageCondition("Warm cambros (>65°C)");
        in1.setAllergens("Dairy, Cashews, Gluten");
        in1.setSpecialInstructions("Sanitized stainless steel vessels. Drive-in loading at rear gate.");
        in1.setPreparedAt(now.minusHours(2));
        in1.setAvailableFrom(now);
        in1.setAvailableUntil(now.plusHours(4));
        in1.setPickupLocation("Barakhamba Rd, Connaught Place, New Delhi 110001");
        in1.setApproximateArea("Connaught Place (~1.2 km)");
        in1.setLatitude(28.6304);
        in1.setLongitude(77.2177);
        in1.setImageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80");
        in1.setStatus(FoodStatus.AVAILABLE);

        FoodListing in2 = new FoodListing();
        in2.setDonor(donorDelhi2);
        in2.setFoodName("Assorted Kaju Sweets, Khasta Kachoris & Gulab Jamun");
        in2.setDescription("Fresh festival surplus boxes of assorted sweets, spiced mung dal kachoris, and soft warm gulab jamuns.");
        in2.setCategory("Bakery");
        in2.setQuantity("40 sealed snack boxes");
        in2.setServings(45);
        in2.setFoodType(FoodType.VEGETARIAN);
        in2.setEventType("Store Daily Surplus");
        in2.setStorageCondition("Cool dry ambient");
        in2.setAllergens("Dairy, Gluten, Nuts");
        in2.setSpecialInstructions("Individually packed in airtight boxes with manufacture stamps.");
        in2.setPreparedAt(now.minusHours(3));
        in2.setAvailableFrom(now);
        in2.setAvailableUntil(now.plusHours(6));
        in2.setPickupLocation("Ajmal Khan Rd, Karol Bagh, New Delhi 110005");
        in2.setApproximateArea("Karol Bagh (~2.5 km)");
        in2.setLatitude(28.6517);
        in2.setLongitude(77.1906);
        in2.setImageUrl("https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80");
        in2.setStatus(FoodStatus.AVAILABLE);

        FoodListing in3 = new FoodListing();
        in3.setDonor(donorMumbai);
        in3.setFoodName("Mumbai Pav Bhaji & Vegetable Dum Pulao Trays");
        in3.setDescription("Buttery slow-simmered vegetable bhaji, 100 soft pav buns, and fragrant basmati vegetable pulao with raita.");
        in3.setCategory("Cooked Meals");
        in3.setQuantity("8 deep catering trays (~40 kg)");
        in3.setServings(80);
        in3.setFoodType(FoodType.VEGETARIAN);
        in3.setEventType("Corporate Gala");
        in3.setStorageCondition("Thermal insulated chafers");
        in3.setAllergens("Dairy, Gluten");
        in3.setSpecialInstructions("Prepared with pure ghee and Amul butter. Ready for immediate distribution.");
        in3.setPreparedAt(now.minusHours(1));
        in3.setAvailableFrom(now);
        in3.setAvailableUntil(now.plusHours(3));
        in3.setPickupLocation("Hill Road, Bandra West, Mumbai 400050");
        in3.setApproximateArea("Bandra West");
        in3.setLatitude(19.0596);
        in3.setLongitude(72.8295);
        in3.setImageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80");
        in3.setStatus(FoodStatus.AVAILABLE);

        FoodListing in4 = new FoodListing();
        in4.setDonor(donorBlr);
        in4.setFoodName("Steamed Idlis, Medu Vada & Coconut Chutney");
        in4.setDescription("120 fluffy steamed idlis, 60 crispy medu vadas, freshly ground coconut chutney, and piping hot drumstick sambar.");
        in4.setCategory("Cooked Meals");
        in4.setQuantity("5 insulated food boxes");
        in4.setServings(60);
        in4.setFoodType(FoodType.VEGAN);
        in4.setEventType("Morning Conference Breakfast");
        in4.setStorageCondition("Insulated cambros");
        in4.setAllergens("Mustard seeds (in tadka)");
        in4.setSpecialInstructions("Pure plant-based vegan preparation.");
        in4.setPreparedAt(now.minusHours(2));
        in4.setAvailableFrom(now);
        in4.setAvailableUntil(now.plusHours(2)); // Expiring soon
        in4.setPickupLocation("80 Feet Rd, Koramangala 4th Block, Bengaluru 560034");
        in4.setApproximateArea("Koramangala");
        in4.setLatitude(12.9352);
        in4.setLongitude(77.6245);
        in4.setImageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80");
        in4.setStatus(FoodStatus.AVAILABLE);

        FoodListing in5 = new FoodListing();
        in5.setDonor(donorHyd);
        in5.setFoodName("Royal Hyderabadi Dum Biryani & Mirchi Ka Salan");
        in5.setDescription("Authentic Hyderabadi dum biryani cooked on coal flame, accompanied by rich sesame-peanut mirchi ka salan and dahi chutney.");
        in5.setCategory("Cooked Meals");
        in5.setQuantity("10 degh / large trays (~50 kg)");
        in5.setServings(75);
        in5.setFoodType(FoodType.NON_VEGETARIAN);
        in5.setEventType("Heritage Banquet");
        in5.setStorageCondition("Covered sealed deghs (>65°C)");
        in5.setAllergens("Dairy, Peanuts, Sesame");
        in5.setSpecialInstructions("Sealed with flour dough during dum. Retains maximum aroma and temperature.");
        in5.setPreparedAt(now.minusHours(2));
        in5.setAvailableFrom(now);
        in5.setAvailableUntil(now.plusHours(4));
        in5.setPickupLocation("Road No. 1, Banjara Hills, Hyderabad 500034");
        in5.setApproximateArea("Banjara Hills");
        in5.setLatitude(17.4156);
        in5.setLongitude(78.4357);
        in5.setImageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80");
        in5.setStatus(FoodStatus.AVAILABLE);

        FoodListing in6 = new FoodListing();
        in6.setDonor(donorPune);
        in6.setFoodName("Poha, Sabudana Khichdi & Upma Breakfast Trays");
        in6.setDescription("Kanda batata poha with roasted peanuts, spiced fasting sabudana khichdi, and semolina vegetable upma.");
        in6.setCategory("Cooked Meals");
        in6.setQuantity("6 hotel pans");
        in6.setServings(50);
        in6.setFoodType(FoodType.VEGAN);
        in6.setEventType("University Seminar");
        in6.setStorageCondition("Refrigerated or warm");
        in6.setAllergens("Peanuts");
        in6.setSpecialInstructions("Fresh lemon wedges and sev packed separately.");
        in6.setPreparedAt(now.minusHours(3));
        in6.setAvailableFrom(now);
        in6.setAvailableUntil(now.plusHours(5));
        in6.setPickupLocation("FC Road, Shivaji Nagar, Pune 411005");
        in6.setApproximateArea("Shivaji Nagar");
        in6.setLatitude(18.5308);
        in6.setLongitude(73.8475);
        in6.setImageUrl("https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80");
        in6.setStatus(FoodStatus.AVAILABLE);

        foodListingRepository.saveAll(List.of(in1, in2, in3, in4, in5, in6));
        System.out.println(">>> Indian surplus food listings seeded successfully!");
    }
}
