import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../../contexts/FeedbackContext';
import { facultySubjectAPI } from '../../services/api';
import { Star, Send, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Card from '../ui/Card';
import Layout from '../layout/Layout';

const schema = yup.object({
  facultyId: yup.number().required('Please select a faculty member'),
  subjectId: yup.number().required('Please select a subject'),
  rating: yup.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').required('Rating is required'),
  comments: yup.string().max(1000, 'Comments must be less than 1000 characters'),
});

const FeedbackForm = () => {
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { subjects, faculty, fetchSubjects, fetchFaculty, submitFeedback } = useFeedback();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedFacultyId = watch('facultyId');

  useEffect(() => {
    // Ensure we have live data loaded
    if (!Array.isArray(faculty) || faculty.length === 0) {
      fetchFaculty();
    }
    if (!Array.isArray(subjects) || subjects.length === 0) {
      fetchSubjects();
    }
    const fetchFacultySubjects = async () => {
      try {
        const response = await facultySubjectAPI.getAll();
        setFacultySubjects(response.data || []);
      } catch (err) {
        if (err.response?.status === 403) {
          console.log('Authentication required for faculty-subject mapping API, using mock data');
        } else {
          console.log('Faculty-subject mapping API failed, using mock data');
        }
        setFacultySubjects([]); // Set empty array on error
      }
    };
    fetchFacultySubjects();
  }, []);

  useEffect(() => {
    if (watchedFacultyId && faculty && Array.isArray(faculty)) {
      const selected = faculty.find(f => f.facultyId === parseInt(watchedFacultyId));
      setSelectedFaculty(selected);
    } else {
      setSelectedFaculty(null);
    }
    setValue('subjectId', ''); // Reset subject when faculty changes
  }, [watchedFacultyId, faculty, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await submitFeedback(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const facultyOptions = (Array.isArray(faculty) ? faculty : []).map(f => ({
    value: f.facultyId,
    label: f.name || f.facultyName
  }));

  const subjectOptions = selectedFaculty 
    ? (Array.isArray(facultySubjects) ? facultySubjects : [])
        .filter(fs => fs.faculty.facultyId === selectedFaculty.facultyId)
        .map(fs => ({
          value: fs.subject.subjectId,
          label: fs.subject.name || fs.subject.subjectName
        }))
    : (Array.isArray(subjects) ? subjects : []).map(s => ({
        value: s.subjectId,
        label: s.name || s.subjectName
      }));

  const StarRating = ({ rating, onRatingChange, error }) => {
    return (
      <div className="space-y-2">
        <label className="form-label">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`p-1 rounded transition-colors ${
                star <= rating 
                  ? 'text-yellow-400 hover:text-yellow-500' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 ? `${rating} out of 5` : 'Select a rating'}
          </span>
        </div>
        {error && (
          <p className="form-error flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message}</span>
          </p>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <Layout title="Feedback Submitted">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your valuable feedback. It will help improve our academic experience.
              </p>
              <Button onClick={() => navigate('/student/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Submit Feedback">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Feedback</h2>
          <p className="text-gray-600">
            Share your experience to help improve our academic quality
          </p>
        </div>

        {/* API Status Notice removed for live data */}

        {/* Feedback Form */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert type="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <div className="space-y-6">
              {/* Faculty Selection */}
              <FormField
                label="Faculty Member"
                type="select"
                name="facultyId"
                register={register}
                error={errors.facultyId}
                placeholder="Select a faculty member"
                options={facultyOptions}
                required
              />

              {/* Subject Selection */}
              <FormField
                label="Subject"
                type="select"
                name="subjectId"
                register={register}
                error={errors.subjectId}
                placeholder={selectedFaculty ? "Select a subject" : "First select a faculty member"}
                options={subjectOptions}
                required
                disabled={!selectedFaculty}
              />

              {/* Rating */}
              <StarRating
                rating={watch('rating') || 0}
                onRatingChange={(rating) => setValue('rating', rating)}
                error={errors.rating}
              />

              {/* Comments */}
              <FormField
                label="Comments (Optional)"
                type="textarea"
                name="comments"
                register={register}
                error={errors.comments}
                placeholder="Share your detailed feedback, suggestions, or comments..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/student/dashboard')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                icon={<Send className="w-4 h-4" />}
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Guidelines */}
        <Card>
          <Card.Header title="Feedback Guidelines" subtitle="Help us provide better feedback">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Be Specific</h4>
                    <p className="text-sm text-gray-500">Provide specific examples and details.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Be Constructive</h4>
                    <p className="text-sm text-gray-500">Focus on suggestions for improvement.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Be Respectful</h4>
                    <p className="text-sm text-gray-500">Maintain a professional tone.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Be Honest</h4>
                    <p className="text-sm text-gray-500">Provide genuine and honest feedback.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card.Header>
        </Card>
      </div>
    </Layout>
  );
};

export default FeedbackForm;