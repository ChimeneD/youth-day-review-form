import { readFileSync } from "node:fs";
import path from "node:path";

import { YouthDaySurvey } from "@/components/youth-day-survey";

function getStaticSurveyAssets() {
  const htmlPath = path.join(process.cwd(), "app", "utils", "index.html");
  const html = readFileSync(htmlPath, "utf8");

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const imageMatches = Array.from(
    html.matchAll(/data:image\/jpeg;base64,[^"]+/g),
    (match) => match[0]
  );

  return {
    pageStyles: styleMatch?.[1] ?? "",
    logoSrc: imageMatches[0] ?? "",
    watermarkSrc: imageMatches[1] ?? "",
  };
}

export default function Home() {
  const { pageStyles, logoSrc, watermarkSrc } = getStaticSurveyAssets();

  return (
    <YouthDaySurvey
      pageStyles={pageStyles}
      logoSrc={logoSrc}
      watermarkSrc={watermarkSrc}
    />
  );
}
