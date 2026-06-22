export default function Home() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
        background: "#FAFAFB"
      }}
    >
      <iframe
        title="YearOne dashboard"
        src="/yearone-ui/YearOne%20Agent.dc.html"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          background: "#FAFAFB"
        }}
      />
    </main>
  );
}
