package org.egov.vendor.supervisor.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.producer.Producer;
import org.egov.vendor.supervisor.repository.querybuilder.SupervisorQueryBuilder;
import org.egov.vendor.supervisor.repository.rowmapper.SupervisorRowMapper;
import org.egov.vendor.supervisor.web.model.Supervisor;
import org.egov.vendor.supervisor.web.model.SupervisorRequest;
import org.egov.vendor.supervisor.web.model.SupervisorResponse;
import org.egov.vendor.supervisor.web.model.SupervisorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class SupervisorRepository {

    @Autowired private Producer producer;
    @Autowired private VendorConfiguration configuration;
    @Autowired private SupervisorQueryBuilder queryBuilder;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private SupervisorRowMapper rowMapper;

    public void save(SupervisorRequest request) {
        producer.push(configuration.getSaveSupervisorTopic(), request);
    }

    public void update(SupervisorRequest request) {
        producer.push(configuration.getUpdateSupervisorTopic(), request);
    }

    public SupervisorResponse getSupervisorData(SupervisorSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getSearchQuery(criteria, preparedStmtList);
        log.info("SupervisorSearch Query: {}", query);
        List<Supervisor> data = jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
        return SupervisorResponse.builder()
                .supervisors(data)
                .totalCount(rowMapper.getFullCount())
                .build();
    }

    /**
     * Returns vendor IDs owned by the given user UUID.
     * Used for role-based restriction — agency users can only see
     * supervisors belonging to their own vendor.
     */
    public List<String> getVendorIdsByOwner(String ownerUuid) {
        String query = "SELECT id FROM eg_vendor WHERE owner_id = ?";
        return jdbcTemplate.query(query, new Object[]{ownerUuid},
                new SingleColumnRowMapper<>(String.class));
    }
}