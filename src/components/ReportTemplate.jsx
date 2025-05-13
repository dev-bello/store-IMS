"use client";
import { saveAs } from "file-saver";
import "./ReportTemplate.css";

const ReportTemplate = ({ title, date, items, reportType, month, year }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleDownloadDocx = async () => {
    const {
      Document,
      Packer,
      Paragraph,
      Table,
      TableCell,
      TableRow,
      TextRun,
      AlignmentType,
    } = await import("docx");

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "NMDPRA",
              alignment: AlignmentType.CENTER,
              heading: "Heading1",
            }),
            new Paragraph({
              text: "Memorandum",
              alignment: AlignmentType.CENTER,
              heading: "Heading2",
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "To: ", bold: true }),
                new TextRun("AD, Admin"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "From: ", bold: true }),
                new TextRun("MGR, Stores"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Date: ", bold: true }),
                new TextRun(formattedDate),
              ],
            }),
            new Paragraph({
              text: title,
              alignment: AlignmentType.CENTER,
              heading: "Heading3",
              spacing: {
                before: 400,
                after: 400,
              },
            }),
            new Table({
              width: {
                size: 100,
                type: "pct",
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 10, type: "pct" },
                      children: [new Paragraph({ text: "S/N", bold: true })],
                    }),
                    new TableCell({
                      width: { size: 50, type: "pct" },
                      children: [
                        new Paragraph({ text: "DESCRIPTION", bold: true }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 20, type: "pct" },
                      children: [
                        new Paragraph({ text: "QUANTITY", bold: true }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 20, type: "pct" },
                      children: [
                        new Paragraph({ text: "REMARKS", bold: true }),
                      ],
                    }),
                  ],
                }),
                ...items.map(
                  (item, index) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({ text: (index + 1).toString() }),
                          ],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: item.name })],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: `${item.quantity} ${item.unit}`,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: item.remarks.join(", ") || "",
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const reportName =
      reportType === "monthly"
        ? `NMDPRA_Monthly_Report_${month}_${year}.docx`
        : `NMDPRA_Weekly_Report_${new Date().toISOString().split("T")[0]}.docx`;
    saveAs(blob, reportName);
  };

  return (
    <div className="report-template">
      <div className="report-actions">
        <button className="btn btn-primary" onClick={handleDownloadDocx}>
          Download as DOCX
        </button>
      </div>
      <div className="report-preview">
        <div className="report-header">
          <div className="report-logo">
            <img src="/nmdpra-logo.png" alt="NMDPRA Logo" />
            <h3>NMDPRA</h3>
          </div>
          <h2>Memorandum</h2>
          <div className="report-meta">
            <div className="meta-row">
              <span className="meta-label">To:</span>
              <span className="meta-value">AD, Admin</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">From:</span>
              <span className="meta-value">MGR, Stores</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Date:</span>
              <span className="meta-value">{formattedDate}</span>
            </div>
          </div>
          <h3 className="report-title">{title}</h3>
        </div>
        <table className="report-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>DESCRIPTION</th>
              <th>QUANTITY</th>
              <th>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>{item.remarks.join(", ") || ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTemplate;
