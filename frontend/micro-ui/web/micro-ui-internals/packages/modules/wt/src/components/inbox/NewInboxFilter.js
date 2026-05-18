import React, { useState, useEffect } from "react";
import { RemoveableTag, CloseSvg, SubmitBar, Dropdown, DatePicker } from "@djb25/digit-ui-react-components";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const Filter = ({ searchParams, onFilterChange, defaultSearchParams, statusMap, moduleCode, ...props }) => {
  const { t } = useTranslation();
  const client = useQueryClient();

  const [_searchParams, setSearchParams] = useState(() => ({ ...searchParams, services: [] }));

  useEffect(() => {
    setSearchParams({ ...searchParams, services: searchParams?.services || [] });
  }, [searchParams]);

  const statusOptions =
    moduleCode === "TP"
      ? [
          { i18nKey: "TP_BOOKING_CREATED", code: "BOOKING_CREATED", value: t("TP_BOOKING_CREATED"), uuid: "BOOKING_CREATED" },
          { i18nKey: "TP_PENDING_FOR_APPROVAL", code: "PENDING_FOR_APPROVAL", value: t("TP_PENDING_FOR_APPROVAL"), uuid: "PENDING_FOR_APPROVAL" },
          { i18nKey: "TP_PAYMENT_PENDING", code: "PAYMENT_PENDING", value: t("TP_PAYMENT_PENDING"), uuid: "PAYMENT_PENDING" },
          {
            i18nKey: "TP_TEAM_ASSIGNMENT_FOR_VERIFICATION",
            code: "TEAM_ASSIGNMENT_FOR_VERIFICATION",
            value: t("TP_TEAM_ASSIGNMENT_FOR_VERIFICATION"),
            uuid: "TEAM_ASSIGNMENT_FOR_VERIFICATION",
          },
          { i18nKey: "TP_TEAM_ASSIGNMENT_FOR_EXECUTION", code: "TEAM_ASSIGNMENT_FOR_EXECUTION", value: t("TP_TEAM_ASSIGNMENT_FOR_EXECUTION"), uuid: "TEAM_ASSIGNMENT_FOR_EXECUTION" },
          { i18nKey: "TP_TREE_PRUNING_SERVICE_COMPLETED", code: "TREE_PRUNING_SERVICE_COMPLETED", value: t("TP_TREE_PRUNING_SERVICE_COMPLETED"), uuid: "TREE_PRUNING_SERVICE_COMPLETED" },
        ]
      : [
          { i18nKey: "WT_SCHEDULED", code: "SCHEDULED", value: t("WT_SCHEDULED"), uuid: "SCHEDULED" },
          { i18nKey: "WT_IN_TRANSIT", code: "IN_TRANSIT", value: t("WT_IN_TRANSIT"), uuid: "IN_TRANSIT" },
          { i18nKey: "WT_TANKER_DELIVERED", code: "TANKER_DELIVERED", value: t("WT_TANKER_DELIVERED"), uuid: "TANKER_DELIVERED" },
          { i18nKey: "WT_MISSED", code: "MISSED", value: t("WT_MISSED"), uuid: "MISSED" },
          { i18nKey: "WT_CANCELLED", code: "CANCELLED", value: t("WT_CANCELLED"), uuid: "CANCELLED" },
        ];

  const localParamChange = (filterParam) => {
    let keys_to_delete = filterParam.delete;
    let _new = { ..._searchParams, ...filterParam };
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete filterParam.delete;
    setSearchParams({ ..._new });
  };

  const applyLocalFilters = () => {
    if (_searchParams.services?.length === 0 && defaultSearchParams?.services) {
      onFilterChange({ ..._searchParams, services: defaultSearchParams.services });
    } else {
      onFilterChange(_searchParams);
    }
  };

  const clearAll = () => {
    const defaultParams = { ...defaultSearchParams, services: defaultSearchParams?.services || searchParams?.services || [], status: null, applicationStatus: null, fromDate: "", fillingPointId: null, fillingPoint: null };
    setSearchParams(defaultParams);
    onFilterChange(defaultParams);
  };

  const tenantId = Digit.ULBService.getCurrentTenantId();
 
  return (
    <React.Fragment>
      <div className="filter-card">
        <div className="heading" style={{ alignItems: "center" }}>
          <div className="filter-label" style={{ display: "flex", alignItems: "center" }}>
            <span>
              <svg width="17" height="17" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z"
                  fill="#505A5F"
                />
              </svg>
            </span>
            <span style={{ marginLeft: "8px", fontWeight: "normal" }}>{t("ES_COMMON_FILTER_BY")}:</span>
          </div>
          <div className="clearAll" onClick={clearAll} style={{ cursor: "pointer" }}>
            {t("ES_COMMON_CLEAR_ALL")}
          </div>
          {props.type === "desktop" && (
            <span className="clear-search" onClick={clearAll} style={{ border: "1px solid #e0e0e0", padding: "6px", minWidth: "fit-content", cursor: "pointer" }}>
              <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                  fill="#505A5F"
                />
              </svg>
            </span>
          )}
          {props.type === "mobile" && (
            <span onClick={props.onClose} style={{ cursor: "pointer" }}>
              <CloseSvg />
            </span>
          )}
        </div>
        <div id="filter-form" className="filter-form">
          <div className="filter-form-field">
            <div className="search-field-wrapper">
              <label>{t("PT_COMMON_TABLE_COL_STATUS_LABEL")}</label>
              <Dropdown
                selected={_searchParams?.status}
                select={(val) => localParamChange({ status: val, applicationStatus: val ? [val] : null })}
                option={statusOptions}
                optionKey="i18nKey"
                t={t}
              />
            </div>
            <div className="search-field-wrapper" style={{ marginTop: "16px" }}>
              <label>{t("DATE")}</label>
              <DatePicker
                date={_searchParams?.fromDate}
                onChange={(date) => localParamChange({ fromDate: date })}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="tag-container hide-x-scrollbar">
              {_searchParams?.locality?.map((locality, index) => {
                return (
                  <RemoveableTag
                    key={index}
                    text={t(locality.i18nkey)}
                    onClick={() => {
                      const newLocalities = _searchParams?.locality.filter((loc) => loc.code !== locality.code);
                      localParamChange({ locality: newLocalities });
                      onFilterChange({ ..._searchParams, locality: newLocalities });
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <SubmitBar className="w-fullwidth" onSubmit={() => applyLocalFilters()} label={t("ES_COMMON_APPLY")} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Filter;
