package org.egov.vendor.supervisor.web.model;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class SupervisorResponse {

    @JsonProperty("responseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("supervisors")
    private List<Supervisor> supervisors;

    @JsonProperty("totalCount")
    private Integer totalCount;
}