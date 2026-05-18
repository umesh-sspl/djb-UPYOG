import {  CheckBox, CollapsibleCardPage } from "@djb25/digit-ui-react-components";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const RwhDeclaration = ({ config, onSelect, userType, formData, setError, formState, clearErrors, tenantId }) => {
  const { t } = useTranslation();
  const { control, formState: localFormState, watch, trigger, getValues, setValue } = useForm({
    defaultValues: formData?.declarationData || {
      declarations: Array(9).fill(false),
      submittedBy: { code: "SELF", i18nKey: "WS_SUBMITTED_BY_SELF" },
      signatureFile: null,
      signatureFileStoreId: null,
    },
  });
  const formValue = watch();
  const { errors } = localFormState;

  const { isWSServicesMastersLoading, data: wsServicesMastersData } = Digit.Hooks.ws.useMDMS("dl.djb", "ws-services-masters", ["Declaration"]);

  const [declarationPoints, setDeclarationPoints] = useState([]);

  useEffect(() => {
    if (wsServicesMastersData?.["ws-services-masters"]?.Declaration) {
      setDeclarationPoints(wsServicesMastersData["ws-services-masters"].Declaration);
    }
  }, [wsServicesMastersData]);


  useEffect(() => {
    const isDifferent = !_.isEqual(formData?.declarationData, formValue);
    if (isDifferent) {
      const timer = setTimeout(() => {
        onSelect(config?.key, { ...formValue });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [formValue]);

  const handleCheckboxChange = (index, checked) => {
    const newDeclarations = [...(formValue?.declarations || [])];
    newDeclarations[index] = checked;
    setValue("declarations", newDeclarations);
  };

  return (
    <React.Fragment>
      <CollapsibleCardPage title={t("RWH_DECLARATION")} defaultOpen={true}>
        {declarationPoints.map((point, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #eee" }}
          >
            <span style={{ fontSize: "14px", lineHeight: "1.5", flex: 1, paddingRight: "20px" }}>
              {t(point.code) !== point.code ? t(point.code) : point.description}
            </span>
            <Controller
              control={control}
              name={`declarations.${index}`}
              render={(props) => (
                <CheckBox
                  checked={props.value}
                  onChange={(e) => {
                    handleCheckboxChange(index, e.target.checked);
                    props.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </div>
        ))}
      </CollapsibleCardPage>
    </React.Fragment>
  );
};

export default RwhDeclaration;
