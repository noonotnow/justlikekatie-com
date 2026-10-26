import originalPage from "./_current.html?raw";

export function Current() {
  return (
    <iframe
      title="Original Just Like Katie apex — unchanged reference"
      srcDoc={originalPage}
      sandbox="allow-same-origin"
      style={{ display: "block", width: "100%", height: "100vh", border: 0 }}
    />
  );
}
