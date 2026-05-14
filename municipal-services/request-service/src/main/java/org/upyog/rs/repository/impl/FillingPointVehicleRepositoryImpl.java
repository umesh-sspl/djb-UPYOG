package org.upyog.rs.repository.impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.upyog.rs.repository.FillingPointVehicleRepository;
import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;

import java.util.List;

/**
 * Fetches active vehicles for a filling point.
 *
 * Important rule:
 * Vehicle should be selected only if driver is mapped.
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class FillingPointVehicleRepositoryImpl implements FillingPointVehicleRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<VehicleDriverAssignmentData> findActiveVehiclesWithMappedDriver(
            String tenantId,
            String fillingPointId
    ) {
        String sql = """
            SELECT
                fv.filling_point_id,
                fv.vendor_id,
                v.vehicle_id,
                d.driver_id,
                v.vehicle_type,
                v.vehicle_capacity
            FROM wt_filling_point_vehicle_mapping fv
            JOIN wt_vehicle v
                ON v.vehicle_id = fv.vehicle_id
               AND v.tenant_id = fv.tenant_id
               AND v.active = true
            JOIN wt_driver_vehicle_mapping d
                ON d.vehicle_id = v.vehicle_id
               AND d.tenant_id = v.tenant_id
               AND d.active = true
            WHERE fv.tenant_id = ?
              AND fv.filling_point_id = ?
              AND fv.active = true
            ORDER BY v.vehicle_id
        """;

        log.info("Fetching active vehicles with mapped driver. tenantId={}, fillingPointId={}",
                tenantId, fillingPointId);

        return jdbcTemplate.query(sql, new Object[]{tenantId, fillingPointId}, (rs, rowNum) -> {
            VehicleDriverAssignmentData data = new VehicleDriverAssignmentData();

            data.setFillingPointId(rs.getString("filling_point_id"));
            data.setVendorId(rs.getString("vendor_id"));
            data.setVehicleId(rs.getString("vehicle_id"));
            data.setDriverId(rs.getString("driver_id"));
            data.setVehicleType(rs.getString("vehicle_type"));
            data.setVehicleCapacity(rs.getString("vehicle_capacity"));
            data.setAssignedCount(0);

            return data;
        });
    }
}