import React, { useMemo, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown, Loader } from "@djb25/digit-ui-react-components";

// Custom marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const fillingPointIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const fixedPointIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const enlargedFixedPointIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [35, 57],
  iconAnchor: [17.5, 57],
  popupAnchor: [1, -45],
  shadowSize: [50, 50],
  className: "bouncing-marker"
});

const bounceStyles = `
  @keyframes marker-bounce {
    0%, 100% { margin-top: 0px; }
    50% { margin-top: -15px; }
  }
  .bouncing-marker {
    animation: marker-bounce 0.6s infinite ease-in-out !important;
  }
`;

// Component to handle map bounds and centering
const ChangeView = ({ bounds, center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 15, { animate: true });
    } else if (bounds && bounds.length > 0) {
      map.fitBounds(bounds);
    }
  }, [bounds, center, zoom, map]);
  return null;
};

const PointAddressMap = ({ fillingPoints = [], fixedPoints = [], isLoading, t }) => {
  const [selectedFillingPoint, setSelectedFillingPoint] = useState(null);
  const [selectedFixedPoint, setSelectedFixedPoint] = useState(null);
  const [hoveredFixedPointId, setHoveredFixedPointId] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(11);

  const defaultCenter = [28.6139, 77.209]; // Default center (Delhi)

  const getFpId = (fp) => fp?.id || fp?.bookingId || fp?.fillingPointId || fp?.uuid || fp?.fillingpointmetadata?.fillingPointId;

  // Fetch related fixed points via API when a filling point is selected
  const { isLoading: isRelatedLoading, data: relatedFixedPointsData } = Digit.Hooks.wt.useFixedPointSearchAPI(
    {
      tenantId: Digit.ULBService.getCurrentTenantId(),
      filters: { 
        fillingPointId: getFpId(selectedFillingPoint),
        limit: 1000 
      },
    },
    { enabled: !!selectedFillingPoint }
  );

  const relatedFixedPoints = useMemo(() => {
    if (!selectedFillingPoint) return [];
    return relatedFixedPointsData?.waterTankerBookingDetail || [];
  }, [selectedFillingPoint, relatedFixedPointsData]);

  // Points to show on map
  const displayFillingPoints = useMemo(() => {
    if (selectedFillingPoint) {
      return [selectedFillingPoint].filter(fp => fp.address?.latitude && fp.address?.longitude);
    }
    return fillingPoints?.filter(fp => fp.address?.latitude && fp.address?.longitude) || [];
  }, [fillingPoints, selectedFillingPoint]);

  const displayFixedPoints = useMemo(() => {
    if (selectedFixedPoint) {
      return [selectedFixedPoint].filter(fx => fx.address?.latitude && fx.address?.longitude);
    }
    return relatedFixedPoints.filter(fx => fx.address?.latitude && fx.address?.longitude);
  }, [relatedFixedPoints, selectedFixedPoint]);

  const bounds = useMemo(() => {
    const allPoints = [
      ...displayFillingPoints.map(p => [parseFloat(p.address.latitude), parseFloat(p.address.longitude)]),
      ...displayFixedPoints.map(p => [parseFloat(p.address.latitude), parseFloat(p.address.longitude)])
    ];
    if (allPoints.length === 0) return null;
    return allPoints;
  }, [displayFillingPoints, displayFixedPoints]);

  const handleFillingPointSelect = (val) => {
    setSelectedFillingPoint(val);
    setSelectedFixedPoint(null);
    setMapCenter(null); // Clear manual center to allow fitBounds to work
  };

  const handleFixedPointSelect = (val) => {
    setSelectedFixedPoint(val);
    if (val?.address?.latitude && val?.address?.longitude) {
      setMapCenter([parseFloat(val.address.latitude), parseFloat(val.address.longitude)]);
      setMapZoom(16);
    }
  };

  const fixedPointOptions = useMemo(() => {
    return relatedFixedPoints.map(fx => ({
      ...fx,
      displayName: fx?.applicantDetail?.name || fx?.name || "NA"
    }));
  }, [relatedFixedPoints]);

  const handleClear = () => {
    setSelectedFillingPoint(null);
    setSelectedFixedPoint(null);
    setMapCenter(null);
    setMapZoom(11);
  };

  if (isLoading || isRelatedLoading) return <Loader />;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: window.innerWidth < 768 ? "column" : "row",
      height: "700px", 
      width: "100%", 
      borderRadius: "12px", 
      overflow: "hidden", 
      border: "1px solid #ddd", 
      marginTop: "20px", 
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      background: "#fff"
    }}>
      <style>{bounceStyles}</style>
      {/* Sidebar */}
      <div style={{ 
        width: window.innerWidth < 768 ? "100%" : "320px", 
        padding: "24px", 
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background: "#f9f9f9",
        zIndex: 10
      }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#1D4E7F", fontSize: "20px", fontWeight: "600" }}>
          {t("WT_MAP_FILTERS")}
        </h3>
        
        <div className="filter-item">
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#666" }}>
            {t("WT_FILLING_POINT")}
          </label>
          <Dropdown
            option={fillingPoints}
            optionKey="fillingPointName"
            selected={selectedFillingPoint}
            select={handleFillingPointSelect}
            t={t}
            placeholder={t("WT_SELECT_FILLING_POINT")}
          />
        </div>

        {selectedFillingPoint && (
          <div className="filter-item" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "600", color: "#1D4E7F" }}>
              {t("WT_MAPPED_FIXED_POINTS")} ({relatedFixedPoints.length})
            </label>
            <div style={{ 
              maxHeight: "350px", 
              overflowY: "auto", 
              paddingRight: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {relatedFixedPoints.length > 0 ? (
                relatedFixedPoints.map((fx, idx) => {
                  const isSelected = selectedFixedPoint?.id === fx.id || (fx.applicantDetail?.applicantId && selectedFixedPoint?.applicantDetail?.applicantId === fx.applicantDetail?.applicantId);
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleFixedPointSelect(fx)}
                      onMouseEnter={() => {
                        setHoveredFixedPointId(fx.id || fx.applicantDetail?.applicantId || idx);
                        if (fx?.address?.latitude && fx?.address?.longitude) {
                          setMapCenter([parseFloat(fx.address.latitude), parseFloat(fx.address.longitude)]);
                          setMapZoom(16);
                        }
                      }}
                      onMouseLeave={() => setHoveredFixedPointId(null)}
                      style={{
                        padding: "12px",
                        background: isSelected ? "#E6EEF5" : "#fff",
                        border: isSelected ? "1.5px solid #1D4E7F" : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "13px",
                        color: isSelected ? "#1D4E7F" : "#333",
                        fontWeight: isSelected ? "600" : "400",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: isSelected ? "0 2px 8px rgba(29, 78, 127, 0.15)" : (hoveredFixedPointId === (fx.id || fx.applicantDetail?.applicantId || idx) ? "0 4px 12px rgba(0,0,0,0.1)" : "none"),
                        transform: hoveredFixedPointId === (fx.id || fx.applicantDetail?.applicantId || idx) ? "translateX(4px)" : "none"
                      }}
                    >
                      <div style={{ 
                        width: "10px", 
                        height: "10px", 
                        borderRadius: "50%", 
                        background: "#417505",
                        boxShadow: "0 0 4px rgba(65, 117, 5, 0.4)"
                      }}></div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{fx?.applicantDetail?.name || fx?.name || "NA"}</span>
                        <span style={{ fontSize: "11px", color: "#888", fontWeight: "400" }}>{fx?.applicantDetail?.fixedPointId}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#999", fontSize: "13px", border: "1px dashed #ccc", borderRadius: "8px" }}>
                  {t("WT_NO_MAPPED_POINTS")}
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          onClick={handleClear}
          style={{ 
            marginTop: "auto",
            padding: "12px",
            background: "#fff",
            border: "1px solid #1D4E7F",
            color: "#1D4E7F",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => { e.target.style.background = "#1D4E7F"; e.target.style.color = "#fff"; }}
          onMouseOut={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#1D4E7F"; }}
        >
          {t("ES_COMMON_CLEAR_ALL")}
        </button>

        {selectedFillingPoint && (
          <div style={{ marginTop: "20px", padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#333", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              {t("WT_SUMMARY")}
            </h4>
            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#777" }}>{t("WT_FIXED_POINTS")}:</span>
                <span style={{ fontWeight: "600" }}>{relatedFixedPoints.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#777" }}>{t("WT_LOCALITY")}:</span>
                <span style={{ fontWeight: "600" }}>{selectedFillingPoint.address?.locality || "NA"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer 
          center={defaultCenter} 
          zoom={11} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView bounds={bounds} center={mapCenter} zoom={mapZoom} />
          
          {/* Filling Point Markers */}
          {displayFillingPoints.map((fp, index) => (
            <React.Fragment key={`fp-group-${fp.id || index}`}>
              <Circle
                center={[parseFloat(fp.address.latitude), parseFloat(fp.address.longitude)]}
                radius={5000} // 5KM in meters
                pathOptions={{ 
                  color: "#0d2745ff", 
                  fillColor: "#041a34ff", 
                  fillOpacity: 0.1,
                  weight: 1,
                  dashArray: "5, 5" 
                }}
              />
              <Marker 
                key={`fp-${fp.id || index}`} 
                position={[parseFloat(fp.address.latitude), parseFloat(fp.address.longitude)]}
                icon={fillingPointIcon}
              >
                <Popup>
                  <div style={{ padding: "8px", minWidth: "200px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1F5FA8", fontSize: "16px", borderBottom: "1px solid #eee", paddingBottom: "4px" }}>
                      {fp.fillingPointName} (Filling Point)
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <p style={{ margin: 0, fontSize: "12px" }}><strong>{t("WT_FILLING_POINT_CODE")}:</strong> {fp.fillingPointId}</p>
                      <p style={{ margin: 0, fontSize: "12px" }}><strong>{t("WT_LOCALITY")}:</strong> {fp.address?.locality || "NA"}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#1F5FA8" }}><strong>Coverage:</strong> 5 KM Radius</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Fixed Point Markers */}
          {displayFixedPoints.map((fx, index) => {
            const fxId = fx.id || fx.applicantDetail?.applicantId || index;
            const isHovered = hoveredFixedPointId === fxId;
            return (
              <Marker 
                key={`fx-${fxId}`} 
                position={[parseFloat(fx.address.latitude), parseFloat(fx.address.longitude)]}
                icon={isHovered ? enlargedFixedPointIcon : fixedPointIcon}
                zIndexOffset={isHovered ? 1000 : 0}
              >
                <Popup>
                  <div style={{ padding: "8px", minWidth: "200px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#417505", fontSize: "16px", borderBottom: "1px solid #eee", paddingBottom: "4px" }}>
                      {fx?.applicantDetail?.name || fx?.name || "NA"} (Fixed Point)
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <p style={{ margin: 0, fontSize: "12px" }}><strong>{t("WT_FIXED_POINT_CODE")}:</strong> {fx?.applicantDetail?.fixedPointId || "NA"}</p>
                      <p style={{ margin: 0, fontSize: "12px" }}><strong>{t("WT_MOBILE_NUMBER")}:</strong> {fx?.applicantDetail?.mobileNumber || "NA"}</p>
                      <p style={{ margin: 0, fontSize: "12px" }}><strong>{t("WT_LOCALITY")}:</strong> {fx?.address?.locality || "NA"}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default PointAddressMap;
