//CourseManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Divider } from '@mui/material';
import CourseList from './CourseList';
import CourseModal from './CourseModal';
import PDFViewer from './PDFPreview';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  Packer,
  SectionType, 
  TableLayoutType,
  BorderStyle
  
} from "docx";
const generateCLOTable = (clos = []) => {
  if (clos.length === 0) {
    return new Paragraph({
      children: [new TextRun({ text: "No CLOs listed", font: "Times New Roman", size: 20 })],
    });
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      // Header Row
      new TableRow({
        children: ["CLO #", "Course Learning Outcomes (CLOs)", "BT-Level & PLOs"].map((text) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    bold: true,
                    font: "Times New Roman",
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.SINGLE, size: 3, color: "8B0000" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
          })
        ),
      }),

      // Data Rows
      ...clos.map((clo, idx) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              children: [
                
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `CLO ${idx + 1}`,
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  style: idx === clos.length - 1 ? BorderStyle.SINGLE : BorderStyle.NONE,
                  size: 2,
                  color: idx === clos.length - 1 ? "8B0000" : "FFFFFF",
                },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: clo.description,
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.JUSTIFIED,
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  style: idx === clos.length - 1 ? BorderStyle.SINGLE : BorderStyle.NONE,
                  size: 2,
                  color: idx === clos.length - 1 ? "8B0000" : "FFFFFF",
                },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
            }),
            new TableCell({
              
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: clo.bloomLevel,
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: clo.plos?.join(", ") || "",
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  style: idx === clos.length - 1 ? BorderStyle.SINGLE : BorderStyle.NONE,
                  size: 2,
                  color: idx === clos.length - 1 ? "8B0000" : "FFFFFF",
                },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
            }),
            
          ],
          
        })
      ),
    ],
  });
};


const createWeeklyScheduleTable = (weeklyContents) => {
  if (!weeklyContents || weeklyContents.length === 0) {
    return new Paragraph({
      children: [
        new TextRun({
          text: "No weekly schedule available",
          font: "Times New Roman",
          size: 20,
        }),
      ],
    });
  }

  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header row
      new TableRow({
        children: ["Week", "Topics"].map((text, idx) =>
          new TableCell({
            width: { size: idx === 0 ? 11 : 90, type: WidthType.PERCENTAGE },
            borders: {
              top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
              bottom: { size: 2, color: "8B0000", style: BorderStyle.SINGLE },
              left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
              right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text,
                    font: "Times New Roman",
                    bold: true,
                    size: 20,
                    
                  }),
                ],
              }),
            ],
          })
        ),
      }),

      // Data rows
      ...weeklyContents.map((week, i, arr) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
            
              borders: {
                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  size: i === arr.length - 1 ? 2 : 1,
                  color: i === arr.length - 1 ? "8B0000" : "auto",
                },
                left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
              },


              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: week.weekNumber.toString(),
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
            
              width: { size: 90, type: WidthType.PERCENTAGE },
              borders: {
               top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  size: i === arr.length - 1 ? 2 : 1,
                  color: i === arr.length - 1 ? "8B0000" : "auto",
                },
                left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: week.topics?.join("; ") || "",
                      font: "Times New Roman",
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      ),
    ],
  });
};


const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);



 

 const exportToWord = async () => {
  if (selectedIds.length === 0) {
    alert("Please select at least one course to export");
    return;
  }

  try {
    const selectedCourses = courses.filter(course => selectedIds.includes(course._id));

    const createHeading = (text, size, color, bold = false) =>
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold,
            size,
            color,
            font: "Times New Roman",
          }),
        ],
        spacing: { after: 200 },
      });

    const createBodyText = (text) =>
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: 20, // 10pt
            font: "Times New Roman",
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
      });

    const doc = new Document({
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS,
            page: {
              margin: { top: 720, bottom: 720, left: 720, right: 720 },
            },
            column: {
              space: 300,
              count: 2,
            },
          },
          children: [
           
            ...selectedCourses.flatMap((course, index) => [
              new Paragraph({
                pageBreakBefore: index > 0,
                children: [
                  new TextRun({
                    text: `${course.code} - ${course.title}`,
                    size: 28, // 14pt
                    bold: true,
                    color: "00008B",
                    font: "Times New Roman",
                  }),
                ],
                spacing: { after: 300 },
              }),
              //credit hrs and pre preq
              new Paragraph({
  children: [
    new TextRun({
      text: "Credit Hours: ",
      bold: true,
      size: 22, // 11pt
      color: "8B0000", // dark red
      font: "Times New Roman",
    }),
    new TextRun({
      text: `${course.creditHours}`,
      size: 20, // 10pt
      font: "Times New Roman",
    }),
    new TextRun({
      text: "   Prerequisites: ",
      bold: true,
      size: 22, // 11pt
      color: "8B0000", // dark red
      font: "Times New Roman",
    }),
    new TextRun({
      text: `${course.prerequisites}`,
      size: 20, // 10pt
      font: "Times New Roman",
    }),
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 },
}),
//course category


 new Paragraph({
  children: [
    new TextRun({
      text: "Course Category: ",
      bold: true,
      size: 22, // 11pt
      color: "8B0000", // dark red
      font: "Times New Roman",
    }),
    new TextRun({
      text: `${course.courseCategory}`,
      size: 20, // 10pt
      font: "Times New Roman",
    }),
    
    
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 },
}),


              createHeading("Description", 22, "8B0000", true),
              createBodyText(course.description || "No description available"),
createHeading("Textbooks", 22, "8B0000", true),
              ...(course.textbooks?.length
                ? course.textbooks.map(book => createBodyText(book))
                : [createBodyText("No textbooks listed")]),

              createHeading("Reference Materials", 22, "8B0000", true),
              ...(course.references?.length
                ? course.references.map(ref => createBodyText(ref))
                : [createBodyText("No reference materials listed")]),

   
createHeading("Course Learning Outcomes", 22, "8B0000", true),
generateCLOTable(course.clos),
new Paragraph({
  children: [new TextRun(" ")],
  spacing: { after: 200 }, // 15pt space after
}),




createHeading("Weekly Schedule", 22, "8B0000", true),
createWeeklyScheduleTable(course.weeklyContents),

               new Paragraph({ text: "", spacing: { after: 400 } }),
            ]),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Courses_Export_${new Date().toISOString().slice(0, 10)}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Failed to export to Word. Please try again.");
  }
};

  const selectedCourses = courses.filter((course) => selectedIds.includes(course._id));

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      {/* Left side: PDF Viewer */}
      <Box flex={1} p={2} overflow="auto">
        <Box display="flex" justifyContent="flex-end" mb={2} gap={2} className="no-print">
          <button
            onClick={() => window.print()}
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Export PDF
          </button>
          <button
            onClick={exportToWord}
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: '#2b579a',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Export MS Word
          </button>
        </Box>

        <Box id="print-area">
          {selectedCourses.length > 0 ? (
            <PDFViewer data={selectedCourses} />
          ) : (
            <Typography variant="h6" color="text.secondary">
              Please select a course first.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Vertical divider */}
      <Divider orientation="vertical" flexItem sx={{ borderColor: '#ccc' }} />

      {/* Right side: Course List */}
      <Box flex={1} p={2} overflow="auto">
        <CourseList
          courses={courses}
          filterText={filterText}
          setFilterText={setFilterText}
          onSelectCourseIds={setSelectedIds}
         
          onExportPDF={() => window.print()}
          onEditCourse={(course) => {
            setSelectedCourse(course);
            setShowModal(true);
          }}
        />
      </Box>

      {/* Modal for adding/editing course */}
      {showModal && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setShowModal(false)}
        
          
        />
      )}
    </Box>
  );
};

export default CourseManager;