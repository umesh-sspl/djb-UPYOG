import React from "react";

const AccessDenied = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #f8fafc 0%, #fefce8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253,224,71,0.18) 0%, rgba(253,224,71,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-180px",
          left: "-120px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "560px",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(226,232,240,0.8)",
          borderRadius: "32px",
          padding: "56px 48px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "110px",
            height: "110px",
            margin: "0 auto 32px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 40px rgba(250, 204, 21, 0.18)",
            fontSize: "52px",
          }}
        >
          ☀️
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "999px",
            padding: "8px 14px",
            color: "#64748b",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "22px",
          }}
        >
          Restricted Area
        </div>

        {/* Heading */}
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            lineHeight: 1.1,
            fontWeight: "700",
            letterSpacing: "-1.4px",
            color: "#0f172a",
          }}
        >
          Access Restricted
        </h1>

        {/* Description */}
        <p
          style={{
            marginTop: "18px",
            marginBottom: 0,
            color: "#64748b",
            fontSize: "16px",
            lineHeight: 1.8,
            maxWidth: "460px",
            marginInline: "auto",
          }}
        >
          You do not currently have permission to access this page. Please use the appropriate portal or contact your administrator if you believe
          this is incorrect.
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <button
            onClick={() => window.history.back()}
            style={{
              border: "1px solid #dbe2ea",
              background: "rgba(255,255,255,0.85)",
              color: "#334155",
              padding: "12px 20px",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.85)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
