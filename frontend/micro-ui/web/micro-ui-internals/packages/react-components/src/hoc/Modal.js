import React, { useEffect } from "react";

import PopUp from "../atoms/PopUp";
import HeaderBar from "../atoms/HeaderBar";
import ButtonSelector from "../atoms/ButtonSelector";
import Toast from "../atoms/Toast";
import ActionBar from "../atoms/ActionBar";
import SubmitBar from "../atoms/SubmitBar";

const Modal = ({
  headerBarMain,
  headerBarEnd,
  popupStyles,
  children,
  actionCancelLabel,
  actionCancelOnSubmit,
  actionSaveLabel,
  actionSaveOnSubmit,
  actionSingleLabel,
  actionSingleSubmit,
  error,
  setError,
  formId,
  isDisabled,
  hideSubmit,
  style = {},
  popupModuleMianStyles,
  headerBarMainStyle,
  isOBPSFlow = false,
  popupModuleActionBarStyles = {},
}) => {
  /**
   * TODO: It needs to be done from the desgin changes
   */
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;

  const baseMainStyles = {
    padding: mobileView ? "12px 12px 16px" : "16px 20px 20px",
  };

  const legacyActionBarStyle = isOBPSFlow
    ? !mobileView
      ? { marginRight: "18px" }
      : { position: "absolute", bottom: "5%", right: "10%", left: window.location.href.includes("employee") ? "0%" : "7%" }
    : popupModuleActionBarStyles;

  const baseActionBarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: mobileView ? "stretch" : "flex-end",
    gap: "12px",
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid rgba(15, 23, 42, 0.08)",
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);
  return (
    <PopUp>
      <style>{`
        @keyframes digit-modal-appear {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <div
        className="popup-module"
        style={{ height: "inherit", overflowY: "scroll", borderRadius: "12px", display: "flex", flexDirection: "column" }}
      >
        <HeaderBar
          main={headerBarMain}
          end={headerBarEnd}
          style={{
            borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
            background: "linear-gradient(180deg, #ffffff 0%, #f5faff 100%)",
            padding: mobileView ? "12px 12px 10px" : "14px 20px",
            ...(headerBarMainStyle || {}),
          }}
        />
        <div className="popup-module-main" style={{ ...baseMainStyles, ...(popupModuleMianStyles || {}), flex: 1, overflowY: "scroll" }}>
          {children}
          <div className="popup-module-action-bar" style={{ ...baseActionBarStyle, ...legacyActionBarStyle }}>
            {actionCancelLabel ? <ButtonSelector theme="border" label={actionCancelLabel} onSubmit={actionCancelOnSubmit} style={style} /> : null}
            {!hideSubmit ? (
              <ButtonSelector label={actionSaveLabel} onSubmit={actionSaveOnSubmit} formId={formId} isDisabled={isDisabled} style={style} />
            ) : null}
            {actionSingleLabel ? (
              <ActionBar
                style={{
                  position: mobileView ? "absolute" : "relative",
                  boxShadow: "none",
                  minWidth: mobileView ? "100%" : "240px",
                  maxWidth: mobileView ? "100%" : "360px",
                  margin: mobileView ? "8px 0 0" : "16px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <SubmitBar style={{ width: "100%" }} label={actionSingleLabel} onSubmit={actionSingleSubmit} />
                </div>
              </ActionBar>
            ) : null}
          </div>
        </div>
      </div>
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </PopUp>
  );
};

export default Modal;
