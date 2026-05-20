package org.upyog.rs.repository.impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.upyog.rs.repository.FillingPointVehicleRepository;
import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;

import java.util.Collections;
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

        String lookupSql = "SELECT id FROM public.upyog_rs_water_tanker_filling_point WHERE filling_point_id = ?";
        String systemFillingPointUuid;
        try {
            systemFillingPointUuid = jdbcTemplate.queryForObject(lookupSql, String.class, fillingPointId);
        } catch (EmptyResultDataAccessException e) {
            log.error("No Filling Point found for code: {}", fillingPointId);
            return Collections.emptyList();
        }

        String sql = "SELECT DISTINCT " +
                "fv.filling_point_id, " +
                "fv.vendor_id, " +
                "v.id AS vehicle_id, " +
                "dm.driver_id, " +
                "v.type AS vehicle_type, " +
                "v.tankcapicity AS vehicle_capacity " +
                "FROM public.eg_wt_fillingpoint_vendor_map fv " +
                "JOIN eg_vendor_vehicle vv ON vv.vendor_id::uuid = fv.vendor_id::uuid " +
                "AND vv.vendorvehiclestatus = 'ACTIVE' " +
                "JOIN eg_vehicle v ON v.id::uuid = vv.vechile_id::uuid " +
                "AND v.status = 'ACTIVE' " +
                "JOIN eg_vehicle_driver_mapping dm ON dm.vehicle_id = v.id " +
                "AND dm.status = 'ACTIVE' " +
                "WHERE fv.filling_point_id = ?::uuid " +
                "AND fv.tenant_id = ?";

        log.info("Fetching active vehicles for System UUID: {}", systemFillingPointUuid);
        log.info("Fetching active vehicles with mapped driver. Checked parameters: tenantId={}, fillingPointId={}",
                tenantId, fillingPointId);

        return jdbcTemplate.query(sql, new Object[]{systemFillingPointUuid, tenantId}, (rs, rowNum) -> {
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