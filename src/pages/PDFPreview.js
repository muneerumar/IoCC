import React from 'react';
import { Box, Typography, Divider, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

const Section = ({ title, children }) => (
  <Box mb={2}>
    <Typography variant="subtitle1" gutterBottom sx={{
      fontWeight: 'bold',
      fontSize: '11pt',
      color: '#8B0000', // Dark red like Word export
      textAlign: 'left',
      pb: 0.5
    }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const PDFViewer = ({ data }) => {
  if (!Array.isArray(data)) {
    return <Typography>Error: Invalid data format</Typography>;
  }

  return (
    <Box id="print-area" sx={{
      width: '210mm',
      minHeight: '297mm',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '10pt',
      lineHeight: '1.6',
      textAlign: 'justify',
      padding: '25mm',
      margin: '0 auto',
      backgroundColor: 'white',
      color: '#000'
    }}>
      {data.map((course, idx) => (
        <Box key={course._id || idx} mb={5} sx={{ breakInside: 'avoid' }}>
          {/* Course Title */}
          <Typography variant="h6" gutterBottom sx={{
            fontWeight: 'bold',
            fontSize: '14pt',
            color: '#00008B', // Dark blue like Word export
            textAlign: 'left',
            mb: 1
          }}>
            {course.code} - {course.title}
          </Typography>

          {/* Credit Hours and Prerequisites */}
          <Typography variant="body2" gutterBottom sx={{ mb: 2, fontSize: '10pt' }}>
            <span style={{ fontWeight: 'bold', color: '#8B0000' }}>Credit Hours: </span>
            {course.creditHours || 'N/A'}
            <span style={{ marginLeft: '20px', fontWeight: 'bold', color: '#8B0000' }}>Prerequisites: </span>
            {course.prerequisites || 'None'}
          </Typography>

          {/* Course Category */}
          <Typography variant="body2" gutterBottom sx={{ mb: 2, fontSize: '10pt' }}>
            <span style={{ fontWeight: 'bold', color: '#8B0000' }}>Course Category: </span>
            {course.courseCategory || 'N/A'}
          </Typography>

          <Section title="Description">
            <Typography variant="body2" sx={{ fontSize: '10pt' }}>
              {course.description || 'No description available'}
            </Typography>
          </Section>

          <Section title="Textbooks">
            {course.textbooks?.length ? (
              <ul style={{ 
                margin: 0, 
                paddingLeft: '15px',
                listStyleType: 'disc',
                fontSize: '10pt'
              }}>
                {course.textbooks.map((book, i) => (
                  <li key={i}>
                    <Typography variant="body2" sx={{ fontSize: '10pt' }}>
                      {book}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : <Typography sx={{ fontSize: '10pt' }}>No textbooks listed</Typography>}
          </Section>

          <Section title="Reference Materials">
            {course.references?.length ? (
              <ul style={{ 
                margin: 0, 
                paddingLeft: '15px',
                listStyleType: 'disc',
                fontSize: '10pt'
              }}>
                {course.references.map((ref, i) => (
                  <li key={i}>
                    <Typography variant="body2" sx={{ fontSize: '10pt' }}>
                      {ref}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : <Typography sx={{ fontSize: '10pt' }}>No references listed</Typography>}
          </Section>

          <Section title="Course Learning Outcomes">
            {course.clos?.length ? (
              <Table size="small" sx={{
                width: '100%',
                borderCollapse: 'collapse',
                mb: 2,
                '& td, & th': {
                  border: '1px solid #000',
                  padding: '6px',
                  fontSize: '10pt'
                },
                '& th': {
                  borderBottom: '2px solid #8B0000',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none'
                },
                '& tr:last-child td': {
                  borderBottom: '2px solid #8B0000'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      width: '10%',
                      border: 'none !important',
                      borderBottom: '2px solid #8B0000 !important'
                    }}>
                      <strong>CLO #</strong>
                    </TableCell>
                    <TableCell sx={{ 
                      width: '70%',
                      border: 'none !important',
                      borderBottom: '2px solid #8B0000 !important'
                    }}>
                      <strong>Course Learning Outcomes (CLOs)</strong>
                    </TableCell>
                    <TableCell sx={{ 
                      width: '20%',
                      border: 'none !important',
                      borderBottom: '2px solid #8B0000 !important'
                    }}>
                      <strong>BT-Level & PLOs</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.clos.map((clo, cloIdx) => (
                    <TableRow key={clo._id || cloIdx}>
                      <TableCell sx={{ textAlign: 'center' }}>CLO-{cloIdx + 1}</TableCell>
                      <TableCell>{clo.description}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <div>{clo.bloomLevel}</div>
                        <div>{clo.plos?.join(', ')}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography sx={{ fontSize: '10pt' }}>No CLOs listed</Typography>
            )}
          </Section>

          <Section title="Weekly Schedule">
            {course.weeklyContents?.length ? (
              <Table size="small" sx={{
                width: '100%',
                borderCollapse: 'collapse',
                mb: 2,
                '& td, & th': {
                  border: '1px solid #000',
                  padding: '6px',
                  fontSize: '10pt'
                },
                '& th': {
                  borderBottom: '2px solid #8B0000',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none'
                },
                '& tr:last-child td': {
                  borderBottom: '2px solid #8B0000'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      width: '10%',
                      border: 'none !important',
                      borderBottom: '2px solid #8B0000 !important'
                    }}>
                      <strong>Week</strong>
                    </TableCell>
                    <TableCell sx={{ 
                      width: '90%',
                      border: 'none !important',
                      borderBottom: '2px solid #8B0000 !important'
                    }}>
                      <strong>Topics</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.weeklyContents.map((week, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ textAlign: 'center' }}>W-{week.weekNumber}</TableCell>
                      <TableCell>{week.topics?.join('; ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <Typography sx={{ fontSize: '10pt' }}>No weekly contents listed</Typography>}
          </Section>

          {idx < data.length - 1 && <Divider sx={{ my: 3 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default PDFViewer;