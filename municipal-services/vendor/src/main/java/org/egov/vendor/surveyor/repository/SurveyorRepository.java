package org.egov.vendor.surveyor.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.producer.Producer;
import org.egov.vendor.surveyor.repository.querybuilder.SurveyorQueryBuilder;
import org.egov.vendor.surveyor.repository.rowmapper.SurveyorRowMapper;
import org.egov.vendor.surveyor.web.model.Surveyor;
import org.egov.vendor.surveyor.web.model.SurveyorRequest;
import org.egov.vendor.surveyor.web.model.SurveyorResponse;
import org.egov.vendor.surveyor.web.model.SurveyorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class SurveyorRepository {

    @Autowired
    private Producer producer;

    @Autowired
    private VendorConfiguration configuration;

    @Autowired
    private SurveyorQueryBuilder surveyorQueryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SurveyorRowMapper surveyorRowMapper;

    public void save(SurveyorRequest surveyorRequest) {
        producer.push(configuration.getSaveSurveyorTopic(), surveyorRequest);
    }

    public void update(SurveyorRequest surveyorRequest) {
        producer.push(configuration.getUpdateSurveyorTopic(), surveyorRequest);
    }

    public SurveyorResponse getSurveyorData(SurveyorSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = surveyorQueryBuilder.getSurveyorSearchQuery(criteria, preparedStmtList);
        log.info("SurveyorSearch Query: {}", query);
        List<Surveyor> surveyors = jdbcTemplate.query(query, preparedStmtList.toArray(), surveyorRowMapper);
        return SurveyorResponse.builder()
                .surveyors(surveyors)
                .totalCount(surveyorRowMapper.getFullCount())
                .build();
    }

    /**
     * Fetch all ACTIVE surveyors for a given vendorId.
     * Used during vendor search enrichment to populate surveyors list.
     */
    public List<Surveyor> getSurveyorsByVendorId(String vendorId, String tenantId) {
        SurveyorSearchCriteria criteria = SurveyorSearchCriteria.builder()
                .vendorId(vendorId)
                .tenantId(tenantId)
                .status(java.util.Arrays.asList("ACTIVE"))
                .limit(-1)
                .offset(0)
                .build();
        List<Object> preparedStmtList = new ArrayList<>();
        String query = surveyorQueryBuilder.getSurveyorSearchQuery(criteria, preparedStmtList);
        log.info("SurveyorsByVendorId Query: {}", query);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), surveyorRowMapper);
    }
}