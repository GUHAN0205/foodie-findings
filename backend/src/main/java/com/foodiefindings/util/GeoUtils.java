package com.foodiefindings.util;

public class GeoUtils {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calculates distance between two points in kilometers using the Haversine formula.
     */
    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double originLat = Math.toRadians(lat1);
        double destLat = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(originLat) * Math.cos(destLat);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = EARTH_RADIUS_KM * c;
        // Round to 2 decimal places
        return Math.round(distance * 100.0) / 100.0;
    }

    public static String formatDistance(Double distanceKm) {
        if (distanceKm == null) {
            return "Unknown distance";
        }
        if (distanceKm < 1.0) {
            long meters = Math.round(distanceKm * 1000);
            return meters + " m away";
        }
        return String.format("%.1f km away", distanceKm);
    }
}
