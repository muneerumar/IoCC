import React, { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  Divider,
  Alert,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
/// to be changed later
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  ////
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const user = JSON.parse(localStorage.getItem('user'));
const createdBy = user ? user.username : 'Unknown';

const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const courseCategories = [
  { value: 'Computing Code', label: 'Computing Core' },
  { value: 'Computer Science Domain', label: 'Computer Science Domain' },
  { value: 'Computer Science Elective', label: 'Computer Science Elective' },
 { value: 'Artificial Intelligence Domain', label: 'Artificial Intelligence Domain' },
  { value: 'Artificial Intelligence Elective', label: 'Artificial Intelligence Elective' },
   { value: 'Software Engineering Domain', label: 'Software Engineering Domain' },
  { value: 'Software Engineering Elective', label: 'Software Engineering Elective' },
  
  { value: 'Data Science Domain', label: 'Data Science Domain' },
  { value: 'Data Science Elective', label: 'Data Science Elective' },
{ value: 'Mathematics', label: 'Mathematics' },
  { value: 'General Education', label: 'General Education' },
   { value: 'Social Science', label: 'Social Sciences' },
    { value: 'Other', label: 'Other' },
 
 
];

const CourseModal = ({ open, onClose, selectedCourse, onRefresh, setCourses, onCourseSaved  }) => {
  // Form state and handlers inside modal
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    prerequisites: 'None',
      courseCategory: 'Not Given',
    creditHours: '3(3+0)',

    description: '',
    clos: [],
    textbooks: [],
    referenceMaterials: [],
    weeklyContents: Array.from({ length: 16 }, (_, i) => ({ weekNumber: i + 1, topics: [], learningOutcomes: [] }))
  });

  const alertRef = useRef(null);
  const [errors, setErrors] = useState({ code: false, title: false });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (selectedCourse && selectedCourse._id) {
      const fullWeekly = Array.from({ length: 16 }, (_, i) => {
        const existing = selectedCourse.weeklyContents?.find(w => w.weekNumber === i + 1);
        return existing || { weekNumber: i + 1, topics: [], learningOutcomes: [] };
      });
      setFormData({ ...selectedCourse, weeklyContents: fullWeekly });
    } else {
      setFormData({
        code: '',
        title: '',
        prerequisites: 'None',
        courseCategory:'Not Given',
        creditHours: '3(3+0)',
     
        description: '',
        clos: [],
        textbooks: [],
        referenceMaterials: [],
        weeklyContents: Array.from({ length: 16 }, (_, i) => ({
          weekNumber: i + 1,
          topics: [],
          learningOutcomes: []
        }))
      });
    }
  }, [selectedCourse?._id]);


  
  // Form handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    if (field === null) updated[index] = value;
    else updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  const addItem = (section, template) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], template] }));
  };

  const removeItem = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  const validateForm = () => {
    const newErrors = {
      code: !formData.code.trim(),
      title: !formData.title.trim()
    };
    setErrors(newErrors);
    return !newErrors.code && !newErrors.title;
  };

const handleSave = async () => {
  if (!validateForm()) {
    setSubmitError('Please fill the required fields');
    setTimeout(() => alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
    return;
  }

  try {
    const cleanData = JSON.parse(JSON.stringify(formData));
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.username || 'Unknown';

    if (cleanData._id) {
      // Existing course: set updatedBy only
      cleanData.updatedBy = username;
 
      await axios.put(   `${REACT_APP_API_BASE_URL}/courses/${cleanData._id}`,  cleanData
);
     
    } else {
      // New course: set createdBy and updatedBy both
      cleanData.createdBy = username;
      cleanData.updatedBy = username;
      await axios.post(`${REACT_APP_API_BASE_URL}/courses/`, cleanData);
    }

    onClose();
  } catch (err) {
    setSubmitError(err.response?.data?.error || 'Failed to save course');
    setTimeout(() => alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  }
};


  return (
    <Dialog
      open={open}
      onClose={onClose}
     // TransitionComponent={Transition}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>

      {/* DialogContent is scrollable, buttons always visible below */}
      <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {submitError && <Alert severity="error" sx={{ mb: 2 }} ref={alertRef}>{submitError}</Alert>}
        <Grid container spacing={1} sx={{ '& .MuiTextField-root': { my: 0.5 } }}>
          {/* Code + Title + Prereq */}
          <Grid item xs={12} md={2} sx={{ width: '9%' }}>
            <TextField
              label="C. Code"
              value={formData.code}
              onChange={e => handleChange('code', e.target.value)}
              fullWidth
              required
              size="small"
              error={errors.code}
              helperText={errors.code ? "Course code is required" : ""}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: '49%' }}>
            <TextField
              label="Course Title"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              fullWidth
              required
              size="small"
              error={errors.title}
              helperText={errors.title ? "Course title is required" : ""}
            />
          </Grid>
          <Grid item xs={12} md={2} sx={{ width: '8%' }}>
            <TextField
              label="Pre-Req"
              value={formData.prerequisites}
              onChange={e => handleChange('prerequisites', e.target.value)}
              fullWidth
              required
              size="small"
            />
          </Grid>

          {/* Credit Hours, Theory, Lab */}
          <Grid item xs={4} sx={{ width: '8%', textAlign: 'center' }}>
            <TextField
              label="Crd Hrs"
                           value={formData.creditHours}
              onChange={e => handleChange('creditHours', e.target.value)}
              fullWidth
              required
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2} sx={{ width: '22%' }}>
   <TextField
  label="Course Category"
  select
  value={formData.courseCategory || ''}
  onChange={e => handleChange('courseCategory', e.target.value)} 
  fullWidth
  required
  size="small"
>
  {courseCategories.map(category => (
    <MenuItem key={category.value} value={category.value}>
      {category.label}
    </MenuItem>
  ))}
</TextField>

          </Grid>
          
          <Divider sx={{ width: '100%', my: '2px' }} />

          {/* Description */}
          <Grid item xs={12} sx={{ width: '99%' }}>
            <TextField
              label="Course Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              fullWidth
              required
              size="small"
            />
          </Grid>

          <Divider sx={{ width: '100%', my: '1px' }} />

          {/* Textbooks */}
          <Grid item xs={12} sx={{ width: '99%' }}>
            {formData.textbooks.map((textbook, index) => (
              <Box key={index} display="flex" gap={1} mb={1}>
                <TextField
                  label="Textbook"
                  value={textbook}
                  onChange={e => handleNestedChange('textbooks', index, null, e.target.value)}
                  fullWidth
                  size="small"
                />
                <IconButton onClick={() => removeItem('textbooks', index)}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addItem('textbooks', '')}>Add Textbook</Button>
          </Grid>

          <Divider sx={{ width: '100%', my: 0.1 }} />

          {/* Reference Materials */}
          <Grid item xs={12} sx={{ width: '99%' }}>
            {formData.referenceMaterials.map((ref, index) => (
              <Box key={index} display="flex" gap={1} mb={1}>
                <TextField
                  label="Reference"
                  value={ref}
                  onChange={e => handleNestedChange('referenceMaterials', index, null, e.target.value)}
                  fullWidth
                  size="small"
                />
                <IconButton onClick={() => removeItem('referenceMaterials', index)}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addItem('referenceMaterials', '')}>Add Reference</Button>
          </Grid>

          <Divider sx={{ width: '100%', my: '2px' }} />

          {/* CLOs */}
          <Grid item xs={12} sx={{ width: '99%' }}>
            {formData.clos.map((clo, index) => (
              <Grid container spacing={1} key={index} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={7} sx={{ width: '63%' }}>
                  <TextField
                    label="Description"
                    value={clo.description}
                    onChange={e => handleNestedChange('clos', index, 'description', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={2} sx={{ width: '15%' }}>
                  <TextField
                    label="Bloom"
                    select
                    value={clo.bloomLevel}
                    onChange={e => handleNestedChange('clos', index, 'bloomLevel', e.target.value)}
                    fullWidth
                    size="small"
                  >
                    {bloomLevels.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={2} sx={{ width: '13%' }}>
                  <TextField
                    label="PLOs"
                    value={clo.plos.join(', ')}
                    onChange={e => handleNestedChange('clos', index, 'plos', e.target.value.split(',').map(v => v.trim()))}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => removeItem('clos', index)}><DeleteIcon /></IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addItem('clos', { description: '', bloomLevel: '', plos: [] })}>Add CLO</Button>
          </Grid>

          <Divider sx={{ width: '100%', my: '2px' }} />

          {/* Weekly Contents */}
          <Grid item xs={12} sx={{ width: '99%' }}>
            <Typography variant="h6">Weekly Contents</Typography>
            {formData.weeklyContents.map((week, index) => (
              <Box key={index} mb={1}>
                <Typography variant="subtitle2">Week {week.weekNumber}</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={8} sx={{ width: '99%' }}>
                   <TextField
  label="Topics"
  value={week.topics.join('\n')}
  onChange={e => handleNestedChange(
    'weeklyContents',
    index,
    'topics',
    e.target.value.split('\n') 
  )}
  fullWidth
  multiline
  rows={2}
  size="small"
/>



                  </Grid>
                {/*  <Grid item xs={4} sx={{ width: '1%' }}>
                    <TextField
                      label="CLOs"
                      value={week.learningOutcomes.join(', ')}
                      onChange={e => handleNestedChange('weeklyContents', index, 'learningOutcomes', e.target.value.split(',').map(lo => lo.trim()))}
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>*/}
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
      </DialogContent>

      {/* Save / Cancel buttons always visible */}
      <DialogActions sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', borderTop: '1px solid #ddd' }}>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;
