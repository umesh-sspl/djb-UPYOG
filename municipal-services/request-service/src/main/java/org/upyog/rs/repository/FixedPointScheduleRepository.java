package org.upyog.rs.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;

import java.util.List;

@Slf4j
@Repository
@RequiredArgsConstructor
public class FixedPointScheduleRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Fetches scheduled fixed points from schedule table.
     *
     * Joins:
     * 1. Schedule table
     * 2. Applicant table
     * 3. Address table
     * 4. Vendor vehicle driver mapping table
     */
    public List<FixedPointScheduleData> findScheduledFixedPointsForDay(
            String tenantId,
            String dayOfWeek
    ) {

        String sql = """
            SELECT
                s.id AS schedule_id,
                s.tenant_id,
                s.filling_point_id,
                s.fixed_point_id,
                s.delivery_time,
                s.water_quantity,

                a.applicant_id,
                a.name AS fixed_point_name,
                a.mobile_number,
                a.alternate_number,
                a.email_id,
                a.type AS applicant_type,
                a.fixed_point_id AS fixed_point_code,

                ad.address_id,
                ad.pincode,
                ad.city,
                ad.city_code,
                ad.address_line_1,
                ad.address_line_2,
                ad.locality,
                ad.locality_code,
                ad.street_name,
                ad.house_no,
                ad.landmark,
                ad.latitude,
                ad.longitude,
                ad.ward,
                ad.zone,
                ad.constituency,

                m.vendor_id,
                m.vehicle_id,
                m.driver_id,
                m.vehicle_type,
                m.vehicle_capacity

            FROM wt_fixed_point_schedule s

            JOIN upyog_rs_water_tanker_applicant_details a
                ON a.fixed_point_id = s.fixed_point_id

            JOIN upyog_rs_water_tanker_address_details ad
                ON ad.applicant_id = a.applicant_id

            JOIN wt_fixed_point_vehicle_driver_mapping m
                ON m.tenant_id = s.tenant_id
               AND m.filling_point_id = s.filling_point_id
               AND m.fixed_point_id = s.fixed_point_id
               AND m.active = true

            WHERE s.tenant_id = ?
              AND s.day_of_week = ?
              AND s.active = true
              AND a.type IN ('FIXED-POINT', 'FIXED_POINT')

            ORDER BY s.filling_point_id, s.delivery_time, s.fixed_point_id
        """;

        log.info("Fetching scheduled fixed points for tenantId={}, dayOfWeek={}",
                tenantId, dayOfWeek);

        return jdbcTemplate.query(sql, new Object[]{tenantId, dayOfWeek}, (rs, rowNum) -> {

            FixedPointScheduleData data = new FixedPointScheduleData();

            data.setScheduleId(rs.getString("schedule_id"));
            data.setTenantId(rs.getString("tenant_id"));

            data.setFillingPointId(rs.getString("filling_point_id"));
            data.setFixedPointId(rs.getString("fixed_point_id"));
            data.setDeliveryTime(rs.getString("delivery_time"));
            data.setWaterQuantity(rs.getString("water_quantity"));

            data.setApplicantId(rs.getString("applicant_id"));
            data.setFixedPointName(rs.getString("fixed_point_name"));
            data.setMobileNumber(rs.getString("mobile_number"));
            data.setAlternateNumber(rs.getString("alternate_number"));
            data.setEmailId(rs.getString("email_id"));
            data.setApplicantType(rs.getString("applicant_type"));
            data.setFixedPointCode(rs.getString("fixed_point_code"));

            data.setAddressId(rs.getString("address_id"));
            data.setPincode(rs.getString("pincode"));
            data.setCity(rs.getString("city"));
            data.setCityCode(rs.getString("city_code"));
            data.setAddressLine1(rs.getString("address_line_1"));
            data.setAddressLine2(rs.getString("address_line_2"));
            data.setLocality(rs.getString("locality"));
            data.setLocalityCode(rs.getString("locality_code"));
            data.setStreetName(rs.getString("street_name"));
            data.setHouseNo(rs.getString("house_no"));
            data.setLandmark(rs.getString("landmark"));
            data.setLatitude(rs.getString("latitude"));
            data.setLongitude(rs.getString("longitude"));
            data.setWard(rs.getString("ward"));
            data.setZone(rs.getString("zone"));
            data.setConstituency(rs.getString("constituency"));

            data.setVendorId(rs.getString("vendor_id"));
            data.setVehicleId(rs.getString("vehicle_id"));
            data.setDriverId(rs.getString("driver_id"));
            data.setVehicleType(rs.getString("vehicle_type"));
            data.setVehicleCapacity(rs.getString("vehicle_capacity"));

            return data;
        });
    }
}