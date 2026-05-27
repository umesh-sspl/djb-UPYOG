import React from "react";

/**
 * SummaryCards Component
 *
 * Props:
 * - cards: Array of card objects:
 *     {
 *       label: string,           // Translation key or display text
 *       count: number,           // Count to display
 *       color: string,           // Hex color for active border & count text
 *       filter: string[] | null, // Status codes this card filters by
 *       active?: boolean,        // Explicit active override (used for "Total" card)
 *     }
 * - searchParams: object         // e.g. { status: { code: "SCHEDULED" } }
 * - t: function                  // i18n translation function (defaults to identity)
 * - onCardClick: function        // (card) => void — called when a card is clicked
 *
 * Minimal usage example:
 *
 *   const cards = [
 *     { label: "Total", count: 42, color: "#0B2559", filter: null, active: true },
 *     { label: "Scheduled", count: 10, color: "#F59E0B", filter: ["SCHEDULED"] },
 *   ];
 *   <SummaryCards cards={cards} searchParams={{}} t={(k) => k} onCardClick={console.log} />
 */
const SummaryCards = ({ cards = [], searchParams = {}, t = (k) => k, onCardClick }) => {
  return (
    <div className="summary-cards-container" style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
      {cards.map((card, idx) => {
        const isActive = searchParams?.status?.code ? card.filter?.includes(searchParams.status.code) : card.active;

        return (
          <div
            key={idx}
            className="summary-card"
            onClick={() => onCardClick?.(card)}
            style={{
              backgroundColor: "#fff",
              borderRadius: "6px",
              padding: "16px 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              flex: "1 1 0%",
              minWidth: "110px",
              border: isActive ? `2px solid ${card.color}` : "1px solid #E2E8F0",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#64748B",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t(card.label)}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: card.color,
                marginTop: "12px",
              }}
            >
              {String(card.count).padStart(2, "0")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
