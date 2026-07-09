export const ogImageSize = { width: 1200, height: 630 };

export function ogImageElement() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
        background: "#1E2156",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -140,
          right: -140,
          width: 480,
          height: 480,
          borderRadius: 9999,
          background: "#F21B94",
          opacity: 0.9,
          transform: "rotate(12deg)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 36,
          fontWeight: 700,
          color: "#FF6ACC",
          letterSpacing: 4,
        }}
      >
        VIPSTUDY
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 62,
          fontWeight: 800,
          color: "#ffffff",
          lineHeight: 1.15,
          maxWidth: 860,
        }}
      >
        Навчання у Словаччині без ЗНО
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 30,
          color: "rgba(255,255,255,0.75)",
          maxWidth: 760,
        }}
      >
        Безкоштовна вища освіта · гуртожиток · повний супровід вступу
      </div>
    </div>
  );
}
