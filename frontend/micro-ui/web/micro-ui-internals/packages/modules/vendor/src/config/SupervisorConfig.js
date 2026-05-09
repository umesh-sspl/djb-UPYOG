import React from "react";
const { Dropdown } = require("@djb25/digit-ui-react-components");

const SupervisorConfig = (t, agencies = [], reportingManagers = [], disabled = false) => {
  return [
    {
      head: "ES_VENDOR_SUPERVISOR_BASIC_DETAILS",
      body: [
        {
          label: "ES_VENDOR_SUPERVISOR_FULL_NAME",
          isMandatory: true,
          type: "text",
          disable: disabled,
          populators: {
            name: "fullName",
            validation: {
              required: true,
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: t("ES_VENDOR_INVALID_NAME"),
              },
            },
            error: t("ES_VENDOR_INVALID_NAME"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_VENDOR_SUPERVISOR_MOBILE_NUMBER",
          isMandatory: true,
          type: "mobileNumber",
          disable: disabled,
          populators: {
            name: "mobileNumber",
            validation: {
              required: true,
              pattern: /^[6-9]\d{9}$/,
            },
            error: t("ES_VENDOR_INVALID_MOBILE"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_VENDOR_SUPERVISOR_EMAIL_ID",
          isMandatory: true,
          type: "text",
          populators: {
            name: "emailId",
            validation: {
              required: true,
              pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+$/,
            },
            error: t("ES_VENDOR_INVALID_EMAIL"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_VENDOR_SUPERVISOR_EMPLOYEE_ID",
          isMandatory: true,
          type: "text",
          populators: {
            name: "employeeId",
            validation: {
              required: true,
            },
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_VENDOR_SUPERVISOR_GENDER",
          isMandatory: false,
          type: "component",
          key: "gender",
          component: "SelectGender",
          texts: {
            headerCaption: "",
            header: "CS_COMMON_CHOOSE_GENDER",
            cardText: "CS_COMMON_SELECT_GENDER",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
        },
      ],
    },
    {
      head: "ES_VENDOR_SUPERVISOR_ROLE_ACCESS",
      body: [
        {
          label: "ES_VENDOR_SUPERVISOR_ROLE",
          isMandatory: true,
          type: "custom",
          populators: {
            name: "role",
            component: (props, customProps) => (
              <Dropdown
                option={[{ code: "SUPERVISOR", name: "Supervisor" }]}
                optionKey="name"
                select={props.onChange}
                selected={props.value}
                t={t}
                disable={true}
              />
            ),
            defaultValue: { code: "SUPERVISOR", name: "Supervisor" },
          },
        },
        {
          label: "ES_VENDOR_SUPERVISOR_AGENCY_NAME",
          isMandatory: true,
          type: "custom",
          populators: {
            name: "agencyName",
            component: (props, customProps) => <Dropdown option={agencies} optionKey="name" select={props.onChange} selected={props.value} t={t} />,
          },
        },
        {
          label: "ES_VENDOR_SUPERVISOR_REPORTING_MANAGER",
          isMandatory: false,
          type: "custom",
          populators: {
            name: "reportingManager",
            component: (props, customProps) => (
              <Dropdown option={reportingManagers} optionKey="name" select={props.onChange} selected={props.value} t={t} />
            ),
          },
        },
      ],
    },
    {
      head: "ES_VENDOR_SUPERVISOR_AREA_ASSIGNMENT",
      body: [
        {
          type: "component",
          component: "SupervisorAreaAssignment",
          key: "areaAssignment",
          withoutLabel: true,
        },
      ],
    },
  ];
};

export default SupervisorConfig;
