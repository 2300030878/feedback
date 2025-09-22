import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../../contexts/FeedbackContext';
import { eventsAPI, feedbackAPI, facultyAPI, facultySubjectAPI } from '../../services/api';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Card from '../ui/Card';
import Layout from '../layout/Layout';

const schema = yup.object({
  // Use mixed() to avoid RHF string/number mismatch blocking submit
  facultyId: yup.mixed().required('Faculty is required'),
  subjectId: yup.mixed().required('Subject is required'),
  eventId: yup.mixed().optional(),
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
  const [events, setEvents] = useState({ upcoming: [], active: [], past: [] });
  const [showModal, setShowModal] = useState(false);
  const [bound, setBound] = useState({ facultyId: null, subjectId: null, facultyName: '', subjectName: '' });
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [ratingVal, setRatingVal] = useState(0);

  const watchedFacultyId = watch('facultyId');

  useEffect(() => {
    // Ensure we have live data loaded
    if (!Array.isArray(faculty) || faculty.length === 0) {
      fetchFaculty();
    }
    if (!Array.isArray(subjects) || subjects.length === 0) {
      fetchSubjects();
    }
    // defer mapping fetch until user clicks Submit on an event
    // Load events segmented for student
    const loadEvents = async () => {
      try {
        const res = await eventsAPI.forStudent();
        setEvents({
          upcoming: res.data?.upcoming || [],
          active: res.data?.active || [],
          past: res.data?.past || [],
        })
      } catch (_) {
        // Fallback to 3 endpoints if /student/me fails
        try {
          const [a, u, p] = await Promise.all([
            eventsAPI.active(),
            eventsAPI.upcoming(),
            eventsAPI.past(),
          ])
          setEvents({ active: a.data || [], upcoming: u.data || [], past: p.data || [] })
        } catch {
          setEvents({ active: [], upcoming: [], past: [] })
        }
      }
    }
    loadEvents();
    const onChanged = () => loadEvents();
    window.addEventListener('feedback:events:changed', onChanged);
    const id = setInterval(loadEvents, 15000);
    return () => { clearInterval(id); window.removeEventListener('feedback:events:changed', onChanged); };
  }, []);

  const openSubmit = async (ev) => {
    try {
      // Determine subject binding from event
      const subjectId = ev.subjectId || ev.subject?.subjectId
      let facultyName = ''
      let facultyId = null
      if (subjectId) {
        try {
          const map = await facultySubjectAPI.getBySubject(subjectId)
          const mappings = Array.isArray(map.data) ? map.data : []
          if (mappings.length > 0) {
            facultyId = mappings[0]?.faculty?.facultyId || null
            facultyName = mappings[0]?.faculty?.name || mappings[0]?.faculty?.facultyName || ''
          }
        } catch (e) {
          // Fallback: pick first faculty as placeholder so the form remains usable
          try {
            const fac = await facultyAPI.getAll()
            const list = Array.isArray(fac.data) ? fac.data : []
            if (list.length > 0) {
              facultyId = list[0]?.facultyId || null
              facultyName = list[0]?.name || list[0]?.facultyName || ''
            }
          } catch (_) {}
        }
      }
      const subjectName = ev.subjectName || ev.subject?.subjectName || ''
      setBound({ facultyId, subjectId, facultyName, subjectName })
      setValue('facultyId', facultyId, { shouldValidate: true })
      setValue('subjectId', subjectId, { shouldValidate: true })
      setValue('eventId', ev.eventId, { shouldValidate: true })
      setRatingVal(0)
      setShowModal(true)
    } catch (_) {
      setShowModal(true)
    }
  }

  useEffect(() => {
    if (watchedFacultyId && faculty && Array.isArray(faculty)) {
      const selected = faculty.find(f => f.facultyId === parseInt(watchedFacultyId));
      setSelectedFaculty(selected);
    } else {
      setSelectedFaculty(null);
    }
    // Only reset when not in modal pre-bound flow
    if (!showModal) {
      setValue('subjectId', '');
    }
  }, [watchedFacultyId, faculty, setValue, showModal]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Client-side sanity check to avoid silent no-ops
      const fid = data.facultyId;
      const sid = data.subjectId;
      const rating = data.rating;
      console.log('[Submit] payload check', { fid, sid, rating, data });
      if (!fid || !sid || !rating) {
        setIsLoading(false);
        setError('Missing faculty, subject, or rating. Please try again.');
        console.warn('[Submit] Missing required fields', { fid, sid, rating, data });
        return;
      }
      console.log('[Submit] calling API with', data);
      await submitFeedback(data);
      console.log('[Submit] success');
      setSuccess(true);
      try { window.dispatchEvent(new CustomEvent('feedback:data:changed')); } catch (_) {}
      try { window.dispatchEvent(new CustomEvent('feedback:events:changed')); } catch (_) {}
      setShowModal(false);
      // refresh local events list in background
      try {
        const [a, u, p] = await Promise.all([eventsAPI.active(), eventsAPI.upcoming(), eventsAPI.past()]);
        setEvents({ active: a.data || [], upcoming: u.data || [], past: p.data || [] });
      } catch (e) { console.warn('[Submit] refresh events failed', e); }
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      console.error('[Submit] failed', err);
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Events list */}
        <Card>
          <Card.Header title="Feedback Events" subtitle="Upcoming, Active, and Past" />
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['active','upcoming','past'].map((k) => (
                <div key={k}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">{k}</h4>
                  <div className="space-y-2">
                    {(events[k] || []).length === 0 && <div className="text-gray-400 text-sm">No {k} events</div>}
                    {(events[k] || []).map(ev => (
                      <div key={ev.eventId} className="p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="font-medium text-gray-900">{ev.title}</div>
                        <div className="text-xs text-gray-500">{new Date(ev.startAt).toLocaleString()} – {new Date(ev.endAt).toLocaleString()}</div>
                        {k === 'active' && (
                          <div className="mt-2">
                            <Button size="sm" onClick={() => openSubmit(ev)}>Submit</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Feedback Form Modal */}
        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[min(640px,95vw)]">
            {error && (
              <Alert type="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <div className="space-y-6">
              {/* Bound faculty/subject (no choice) */}
              <FormField
                label="Faculty Member"
                type="text"
                name="facultyName"
                value={bound.facultyName}
                onChange={()=>{}}
              />
              <input type="hidden" {...register('facultyId')} />
              <FormField
                label="Subject"
                type="text"
                name="subjectName"
                value={bound.subjectName}
                onChange={()=>{}}
              />
              <input type="hidden" {...register('subjectId')} />
              <input type="hidden" {...register('eventId')} />

              {/* Rating */}
              <StarRating
                rating={ratingVal}
                onRatingChange={(rating) => { setRatingVal(rating); setValue('rating', rating, { shouldValidate: true }) }}
                error={errors.rating}
              />
              <input type="hidden" {...register('rating')} />

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
            <div className="flex items-center justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                icon={<Send className="w-4 h-4" />}
                onClick={() => { console.log('[Click] Submit button pressed'); }}
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
          </Card>
        </div>
        )}

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