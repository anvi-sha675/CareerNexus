import { describe, it, expect } from "@jest/globals";
import JSZip from "jszip";
import mammoth from "mammoth";
import { parseResumeText } from "../../services/resumeService.js";

async function buildTestDocx(paragraphs) {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  const body = paragraphs
    .map((p) => `<w:p><w:r><w:t>${p}</w:t></w:r></w:p>`)
    .join("");
  zip.folder("word").file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`,
  );
  return zip.generateAsync({ type: "nodebuffer" });
}

describe("DOCX resume parsing (mammoth)", () => {
  it("extracts real text from a genuine .docx buffer", async () => {
    const buffer = await buildTestDocx([
      "Anvesha Sharma",
      "anvesha.student@example.com",
      "Skills",
      "React, Node.js, MongoDB",
    ]);
    const { value } = await mammoth.extractRawText({ buffer });

    expect(value).toContain("Anvesha Sharma");
    expect(value).toContain("anvesha.student@example.com");
    expect(value).toContain("React, Node.js, MongoDB");
  });

  it("feeds correctly into the existing resume parser once extracted", async () => {
    const buffer = await buildTestDocx([
      "Ishaan Verma",
      "ishaan.v@example.com",
      "+91 98765 43210",
      "Skills",
      "Python, AWS, Docker",
    ]);
    const { value } = await mammoth.extractRawText({ buffer });
    const parsed = parseResumeText(value);

    expect(parsed.email).toBe("ishaan.v@example.com");
    expect(parsed.name).toBe("Ishaan Verma");
    expect(parsed.skills).toEqual(
      expect.arrayContaining(["Python", "AWS", "Docker"]),
    );
  });
});
