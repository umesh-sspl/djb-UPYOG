import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { fixedPointConfig } from "../../config/fixedpoint-config";
import VerticalTimeline from "../../components/VerticalTimeline";

const WTEmergencyFixedPointCreate = () => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();

  // Separate session storage key so it doesn't collide with regular WT_Create
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FP_Create", {});
  const userInfo = Digit.UserService.getUser();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const uuid = userInfo?.info?.uuid;
  const { data: userDetails } = Digit.Hooks.useUserSearch(tenantId, { uuid: [uuid] }, {}, { enabled: uuid ? true : false });

  // Build flat config array
  const config = useMemo(() => {
    let conf = [];
    fixedPointConfig.forEach((obj) => {
      conf = conf.concat(obj.body);
    });
    // Default indexRoute for employee flow
    conf.indexRoute = "fp-info";
    return conf;
  }, []);

  // Clear params if navigating back to info page
  useEffect(() => {
    if (
      params &&
      Object.keys(params).length > 0 &&
      window.location.href.includes("/fp-info") &&
      sessionStorage.getItem("docReqScreenByBack") !== "true"
    ) {
      clearParams();
      queryClient.invalidateQueries("FP_Create");
    }
  }, [params, clearParams, queryClient]);

  /* ------------------------------------------------------------------ */
  /*                            NAVIGATION                               */
  /* ------------------------------------------------------------------ */

  const goNext = useCallback((skipStep, index, isAddMultiple, key) => {
    let currentPath = pathname.split("/").pop();
    let isMultiple = false;
    let nextPage;

    const lastchar = currentPath.charAt(currentPath.length - 1);
    if (Number(parseInt(currentPath)) || currentPath === "0" || currentPath === "-1") {
      if (currentPath === "-1" || currentPath === "-2") {
        currentPath = pathname.slice(0, -3).split("/").pop();
      } else {
        currentPath = pathname.slice(0, -2).split("/").pop();
      }
      isMultiple = true;
    } else {
      isMultiple = false;
    }
    if (!isNaN(lastchar)) isMultiple = true;

    let routeObj = config.find((r) => (key ? r.key === key : r.route === currentPath));
    if (!routeObj) routeObj = config.find((r) => r.route === currentPath);
    let { nextStep = {} } = routeObj || {};

    let redirectWithHistory = skipStep ? history.replace : history.push;
    if (isAddMultiple) nextStep = key;

    if (nextStep === null) {
      return redirectWithHistory(`${match.path}/fp-check`);
    }
    if (!isNaN(nextStep.split("/").pop())) {
      nextPage = `${match.path}/${nextStep}`;
    } else {
      nextPage = isMultiple && nextStep !== "map" ? `${match.path}/${nextStep}/${index}` : `${match.path}/${nextStep}`;
    }
    redirectWithHistory(nextPage);
  }, [pathname, config, match.path, history]);
  const formStepRoutes = ["fp-applicant-details", "fp-address-details", "fp-dispatch-details", "fp-request-details"];

  /* ------------------------------------------------------------------ */
  /*                          SUBMIT / ACK                               */
  /* ------------------------------------------------------------------ */

  const wt_create = async () => {
    // Fixed point always submits as WT fixed point
    history.push(`${match.path}/fp-wt-acknowledgement`);
  };

  /* ------------------------------------------------------------------ */
  /*                         FORM STATE                                  */
  /* ------------------------------------------------------------------ */

  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const handleSelect = useCallback((key, data, skipStep, index, isAddMultiple = false) => {
    const currentParams = paramsRef.current;
    if (key === "multiple") {
      let newParams = { ...currentParams };
      let hasChanged = false;
      Object.keys(data).forEach((k) => {
        if (k !== "navigationKey" && k !== "silent") {
          const updatedValue = { ...newParams[k], ...data[k] };
          let isDifferent = true;
          try {
            isDifferent = JSON.stringify(newParams[k]) !== JSON.stringify(updatedValue);
          } catch (e) {
            // Fallback for circular references: just compare top-level keys loosely
            isDifferent = Object.keys(updatedValue).some(key => newParams[k]?.[key] !== updatedValue[key]);
          }
          if (isDifferent) {
            newParams[k] = updatedValue;
            hasChanged = true;
          }
        }
      });
      if (hasChanged) {
        setParams(newParams);
        paramsRef.current = newParams;
      }
      if (data.silent) return;
      const navigationKey = data.navigationKey || Object.keys(data)[0];
      goNext(skipStep, index, isAddMultiple, navigationKey);
      return;
    }

    if (key === "owners") {
      let owners = currentParams.owners || [];
      let isDifferent = true;
      try {
        isDifferent = JSON.stringify(owners[index]) !== JSON.stringify(data);
      } catch (e) {
        isDifferent = Object.keys(data).some(k => owners[index]?.[k] !== data[k]);
      }
      if (isDifferent) {
        owners[index] = data;
        const newParams = { ...currentParams, [key]: [...owners] };
        setParams(newParams);
        paramsRef.current = newParams;
      }
    } else if (key === "units") {
      let isDifferent = true;
      try {
        isDifferent = JSON.stringify(currentParams.units) !== JSON.stringify(data);
      } catch (e) {
        isDifferent = Object.keys(data).some(k => currentParams.units?.[k] !== data[k]);
      }
      if (isDifferent) {
        const newParams = { ...currentParams, units: data };
        setParams(newParams);
        paramsRef.current = newParams;
      }
    } else {
      const { silent, ...restData } = data;
      const updatedValue = { ...currentParams[key], ...restData };
      let isDifferent = true;
      try {
        isDifferent = JSON.stringify(currentParams[key]) !== JSON.stringify(updatedValue);
      } catch (e) {
        isDifferent = Object.keys(updatedValue).some(k => currentParams[key]?.[k] !== updatedValue[k]);
      }
      if (isDifferent) {
        const newParams = { ...currentParams, [key]: updatedValue };
        setParams(newParams);
        paramsRef.current = newParams;
      }
    }
    if (data?.silent) return;
    goNext(skipStep, index, isAddMultiple, key);
  }, [setParams, goNext]);

  const formStepConfigs = useMemo(() => {
    return config
      .filter((routeObj) => formStepRoutes.includes(routeObj.route))
      .map((routeObj) => ({
        ...routeObj,
        Component: typeof routeObj.component === "string"
          ? Digit.ComponentRegistryService.getComponent(routeObj.component)
          : routeObj.component,
        compConfig: { ...routeObj, isCollapsible: true, defaultOpen: true }
      }));
  }, [config]);

  const onSuccess = () => {
    clearParams();
    queryClient.invalidateQueries("FP_Create");
  };

  /* ------------------------------------------------------------------ */
  /*                      SCROLL TO SECTION                              */
  /* ------------------------------------------------------------------ */

  const isFormStep = formStepRoutes.some((route) => pathname.includes(route));
  const sectionRefs = useRef({});

  useEffect(() => {
    if (isFormStep) {
      const currentRoute = pathname.split("/").pop();
      if (sectionRefs.current[currentRoute]) {
        sectionRefs.current[currentRoute].scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [pathname, isFormStep]);

  /* ------------------------------------------------------------------ */
  /*                      COMPONENT REGISTRY                             */
  /* ------------------------------------------------------------------ */

  const CheckPage     = Digit?.ComponentRegistryService?.getComponent("EmergencyFixedPointCheckPage");
  const WTAcknowledgement = Digit?.ComponentRegistryService?.getComponent("WTEmergencyFixedPointAcknowledgement");

  /* ------------------------------------------------------------------ */
  /*                           RENDER                                    */
  /* ------------------------------------------------------------------ */

  return (
    <React.Fragment>
      <div className="employee-form-section-wrapper">
        {!pathname.includes("/fp-info") && <VerticalTimeline config={config} showFinalStep={true} />}
        <div className="employee-form-section">
          <Switch>
            {/* Review / Check page */}
            <Route path={`${match.path}/fp-check`}>
              <CheckPage onSubmit={wt_create} value={params} />
            </Route>

            {/* Acknowledgement */}
            <Route path={`${match.path}/fp-wt-acknowledgement`}>
              <WTAcknowledgement data={params} onSuccess={onSuccess} />
            </Route>

            {/* Non-form-step routes (info page etc.) */}
            {config.map((routeObj, index) => {
              if (!formStepRoutes.includes(routeObj.route)) {
                const { component, texts, inputs, key, additionaFields } = routeObj;
                const Component =
                  typeof component === "string"
                    ? Digit.ComponentRegistryService.getComponent(component)
                    : component;
                return (
                  <Route path={`${match.path}/${routeObj.route}`} key={index}>
                    <Component
                      config={{ texts, inputs, key, additionaFields }}
                      onSelect={handleSelect}
                      t={t}
                      formData={params}
                      userDetails={userDetails?.user?.[0]}
                    />
                  </Route>
                );
              }
              return null;
            })}

            {/* Single-page scrollable form steps */}
            <Route path={formStepRoutes.map((route) => `${match.path}/${route}`)}>
              <div className="single-page-form-container">
                {formStepConfigs.map((routeObj, index) => {
                  const { Component, compConfig } = routeObj;
                  return (
                    <div
                      key={index}
                      ref={(el) => (sectionRefs.current[routeObj.route] = el)}
                      className="form-section-unit"
                    >
                      <Component
                        config={compConfig}
                        onSelect={handleSelect}
                        t={t}
                        formData={params}
                        userDetails={userDetails?.user?.[0]}
                      />
                    </div>
                  );
                })}
              </div>
            </Route>

            {/* Default redirect */}
            <Route>
              <Redirect to={`${match.path}/${config.indexRoute}`} />
            </Route>
          </Switch>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WTEmergencyFixedPointCreate;
