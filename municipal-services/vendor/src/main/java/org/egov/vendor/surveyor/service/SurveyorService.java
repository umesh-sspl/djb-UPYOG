package org.egov.vendor.surveyor.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.surveyor.repository.SurveyorRepository;
import org.egov.vendor.surveyor.web.model.Surveyor;
import org.egov.vendor.surveyor.web.model.SurveyorRequest;
import org.egov.vendor.surveyor.web.model.SurveyorResponse;
import org.egov.vendor.surveyor.web.model.SurveyorSearchCriteria;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SurveyorService {

    @Autowired
    private SurveyorRepository surveyorRepository;

    @Autowired
    private SurveyorEnrichmentService enrichmentService;

    @Autowired
    private SurveyorUserService userService;

    @Autowired
    private VendorConfiguration config;

    public Surveyor create(SurveyorRequest surveyorRequest) {
        if (surveyorRequest.getSurveyor().getTenantId().split("\\.").length == 1) {
            throw new CustomException("INVALID_TENANT",
                    "Surveyor cannot be created at State level");
        }
        userService.manageSurveyors(surveyorRequest, true);
        enrichmentService.enrichCreate(surveyorRequest);
        surveyorRepository.save(surveyorRequest);
        return surveyorRequest.getSurveyor();
    }

    public Surveyor update(SurveyorRequest surveyorRequest) {
        if (surveyorRequest.getSurveyor().getTenantId().split("\\.").length == 1) {
            throw new CustomException("INVALID_TENANT",
                    "Surveyor cannot be updated at State level");
        }
        userService.manageSurveyors(surveyorRequest, false);
        enrichmentService.enrichUpdate(surveyorRequest);
        surveyorRepository.update(surveyorRequest);
        return surveyorRequest.getSurveyor();
    }

    public SurveyorResponse search(SurveyorSearchCriteria criteria, RequestInfo requestInfo) {
        // Mobile number → resolve to ownerIds
        if (criteria.getMobileNumber() != null) {
            SurveyorSearchCriteria userCriteria =
                    SurveyorSearchCriteria.builder()
                            .tenantId(criteria.getTenantId())
                            .mobileNumber(criteria.getMobileNumber())
                            .build();

            UserDetailResponse userResp = userService.getOwner(userCriteria, requestInfo);

            if (userResp != null && !CollectionUtils.isEmpty(userResp.getUser())) {
                List<String> uuids = userResp.getUser().stream()
                        .map(User::getUuid)
                        .collect(Collectors.toList());

                if (CollectionUtils.isEmpty(criteria.getOwnerIds()))
                    criteria.setOwnerIds(uuids);
                else
                    criteria.getOwnerIds().addAll(uuids);
            }
        }

        SurveyorResponse response = surveyorRepository.getSurveyorData(criteria);

        if (response != null && !CollectionUtils.isEmpty(response.getSurveyors())) {
            enrichmentService.enrichSearch(response.getSurveyors(), requestInfo, criteria.getTenantId());
        }

        if (response != null && CollectionUtils.isEmpty(response.getSurveyors())) {
            response.setSurveyors(new ArrayList<>());
        }

        return response;
    }
}