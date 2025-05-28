// CourseList.js
import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Checkbox,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CourseModal from './CourseModal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const CourseList = ({
  onSelectCourseIds,
  onDeleteCourse,
  onEditCourse,
  courses: externalCourses,
  filterText: externalFilterText,
  setFilterText: setExternalFilterText,
  isControlled = false
}) => {
  const [internalCourses, setInternalCourses] = useState([]);
  const [internalFilterText, setInternalFilterText] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const courses = isControlled ? externalCourses : internalCourses;
  const filterText = isControlled ? externalFilterText : internalFilterText;
  const setFilterText = isControlled ? setExternalFilterText : setInternalFilterText;
const [successMessage, setSuccessMessage] = useState('');
const [openSuccess, setOpenSuccess] = useState(false);
  useEffect(() => {
    if (!isControlled) {
      fetchCourses();
    }
  }, [isControlled]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`);
      setInternalCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
const handleCloseSuccess = () => {
  setOpenSuccess(false);
};
  const handleCheckboxChange = (id) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    setSelectedIds(updated);
    onSelectCourseIds && onSelectCourseIds(updated);
  };

  const handleDeleteCourse = async (id) => {
    // Confirm once before deletion
    const confirmed = window.confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/courses/${id}`);
      if (!isControlled) {
        await fetchCourses();
      }
      onDeleteCourse && onDeleteCourse(id);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowDialog(true);
  };



  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(filterText.toLowerCase()) ||
      course.code?.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box>
     

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

<Snackbar
  open={openSuccess}
  autoHideDuration={4000}
  onClose={handleCloseSuccess}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
    {successMessage}
  </Alert>
</Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Filter courses"
          variant="outlined"
          fullWidth
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          disabled={loading}
          sx={{
            height: '40px',
            '& .MuiInputBase-root': {
              height: '100%',
              fontSize: '16px',
              padding: '0 12px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '16px',
            },
            '& .MuiOutlinedInput-input': {
              padding: '5px 0',
            }
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleEditCourse(null)}
          disabled={loading}
          sx={{
            width: '200px',
            height: '40px',
            padding: '12px 24px',
            margin: '16px 0',
            fontSize: '18px',
            textTransform: 'none'
          }}
        >
          Add New
        </Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow  sx={{ height: 36,backgroundColor:'rgb(179, 196, 209)'  }}>
            <TableCell padding="checkbox" sx={{ py: 0.5 }}>
              <Checkbox
                indeterminate={
                  selectedIds.length > 0 && selectedIds.length < filteredCourses.length
                }
                checked={
                  filteredCourses.length > 0 &&
                  selectedIds.length === filteredCourses.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    const allIds = filteredCourses.map((course) => course._id);
                    setSelectedIds(allIds);
                    onSelectCourseIds && onSelectCourseIds(allIds);
                  } else {
                    setSelectedIds([]);
                    onSelectCourseIds && onSelectCourseIds([]);
                  }
                }}
                disabled={loading || filteredCourses.length === 0}
                size="small"
              />
            </TableCell>
            <TableCell sx={{ py: 0.5, fontWeight: 'bold' }}>C. Code</TableCell>
            <TableCell sx={{ py: 0.5,fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ py: 0.5,fontWeight: 'bold' }}>Credits</TableCell>
             <TableCell sx={{ py: 0.5,fontWeight: 'bold' }}>Authors</TableCell>
            <TableCell align="right" sx={{ py: 0.5,fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <TableRow
                key={course._id}
                sx={{
                  height: 36,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell padding="checkbox" sx={{ py: 0.5 }}>
                  <Checkbox
                    checked={selectedIds.includes(course._id)}
                    onChange={() => handleCheckboxChange(course._id)}
                    disabled={loading}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>{course.code}</TableCell>
                <TableCell sx={{ py: 0.5 }}>{course.title}</TableCell>
                <TableCell sx={{ py: 0.5 }}>{course.creditHours}</TableCell>
             <TableCell sx={{ py: 0.5 }}>
  {(course.createdBy || 'Unknown') + ' ' + (course.updatedBy || '')}
</TableCell>
                <TableCell align="right" sx={{ py: 0.5, width:90}}>
                  <IconButton
                    onClick={() => handleEditCourse(course)}
                    disabled={loading}
                    size="small"
                  >
                    <EditIcon fontSize="very small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteCourse(course._id)}
                    disabled={loading}
                    size="small"
                  >
                    <DeleteIcon fontSize="very small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow sx={{ height: 36 }}>
              <TableCell colSpan={5} align="center" sx={{ py: 0.5 }}>
                {loading ? 'Loading...' : 'No courses found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

 <CourseModal
  open={showDialog}
  onClose={() => setShowDialog(false)}
  onRefresh={fetchCourses}
  selectedCourse={selectedCourse}
 onCourseSaved={async (course, action) => {
  try {
    if (!isControlled) {
      await fetchCourses(); // wait for data refresh
    }
    const message =
      action === 'updated'
        ? `Course "${course.title}" updated successfully.`
        : `Course "${course.title}" added successfully.`;
    setSuccessMessage(message);
    setOpenSuccess(true);
  } catch (error) {
    console.error('Failed to refresh courses after save:', error);
    setError('Failed to refresh courses after saving.');
  }
}}


/>
        
      
    </Box>
  );
};

CourseList.propTypes = {
  onSelectCourseIds: PropTypes.func,
  onDeleteCourse: PropTypes.func,
  onEditCourse: PropTypes.func,
  courses: PropTypes.array,
  filterText: PropTypes.string,
  setFilterText: PropTypes.func,
  isControlled: PropTypes.bool,
};

CourseList.defaultProps = {
  onSelectCourseIds: () => {},
  onDeleteCourse: () => {},
  onEditCourse: () => {},
  courses: [],
  filterText: '',
  setFilterText: () => {},
  isControlled: false,
};

export default CourseList;
