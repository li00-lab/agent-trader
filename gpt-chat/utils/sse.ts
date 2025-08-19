export async function runSSE(
  url: string,
  body: Record<string, any>,
  onMessage: (data: any) => void,
  onError?: (err: any) => void
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");

    for (let i = 0; i < parts.length - 1; i++) {
      try {
        const evt = JSON.parse(parts[i].replace(/^data:\s*/, ""));
        onMessage(evt);
      } catch (err) {
        console.error("Parse error:", err, parts[i]);
      }
    }
    buffer = parts[parts.length - 1];
  }
}
