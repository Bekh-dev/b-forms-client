import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTemplateById,
  selectCurrentTemplate,
  selectTemplatesLoading,
  selectTemplatesError
} from '../../store/slices/templateSlice';
import { submitResponse } from '../../store/slices/responseSlice';

const UseTemplate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const template = useSelector(selectCurrentTemplate);
  const loading = useSelector(selectTemplatesLoading);
  const error = useSelector(selectTemplatesError);

  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch template:', error);
        });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (template?.questions) {
      const initialData = {};
      template.questions.forEach((question, index) => {
        initialData[`question_${index}`] = question.type === 'checkbox' ? [] : '';
      });
      setFormData(initialData);
    }
  }, [template]);

  const handleChange = (questionIndex, value, type) => {
    setFormData(prev => ({
      ...prev,
      [`question_${questionIndex}`]: type === 'checkbox' 
        ? (prev[`question_${questionIndex}`].includes(value)
          ? prev[`question_${questionIndex}`].filter(v => v !== value)
          : [...prev[`question_${questionIndex}`], value])
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!template) return;

    setSubmitStatus({ loading: true, error: null });

    try {
      const responseData = {
        templateId: template._id,
        answers: template.questions.map((question, index) => ({
          question: question.label,
          answer: formData[`question_${index}`]
        }))
      };

      await dispatch(submitResponse(responseData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        error: error.message || 'Failed to submit response' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => dispatch(fetchTemplateById(id))}
          className="text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center p-4">
        <div className="text-gray-500">Template not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{template.title}</h1>
        {template.description && (
          <p className="text-gray-600 mb-6">{template.description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {template.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500">*</span>}
              </label>

              {question.type === 'text' && (
                <input
                  type="text"
                  value={formData[`question_${index}`] || ''}
                  onChange={(e) => handleChange(index, e.target.value, 'text')}
                  placeholder={question.placeholder}
                  required={question.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}

              {question.type === 'number' && (
                <input
                  type="number"
                  value={formData[`question_${index}`] || ''}
                  onChange={(e) => handleChange(index, e.target.value, 'number')}
                  placeholder={question.placeholder}
                  required={question.required}
                  min={question.validation?.min}
                  max={question.validation?.max}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}

              {question.type === 'email' && (
                <input
                  type="email"
                  value={formData[`question_${index}`] || ''}
                  onChange={(e) => handleChange(index, e.target.value, 'email')}
                  placeholder={question.placeholder}
                  required={question.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}

              {question.type === 'date' && (
                <input
                  type="date"
                  value={formData[`question_${index}`] || ''}
                  onChange={(e) => handleChange(index, e.target.value, 'date')}
                  required={question.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}

              {question.type === 'select' && (
                <select
                  value={formData[`question_${index}`] || ''}
                  onChange={(e) => handleChange(index, e.target.value, 'select')}
                  required={question.required}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select an option</option>
                  {question.options?.map((option, optionIndex) => (
                    <option key={optionIndex} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {question.type === 'radio' && (
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        id={`question_${index}_option_${optionIndex}`}
                        name={`question_${index}`}
                        value={option.value}
                        checked={formData[`question_${index}`] === option.value}
                        onChange={(e) => handleChange(index, e.target.value, 'radio')}
                        required={question.required}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label
                        htmlFor={`question_${index}_option_${optionIndex}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`question_${index}_option_${optionIndex}`}
                        value={option.value}
                        checked={(formData[`question_${index}`] || []).includes(option.value)}
                        onChange={(e) => handleChange(index, e.target.value, 'checkbox')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`question_${index}_option_${optionIndex}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {submitStatus.error && (
            <div className="text-red-500 text-sm">{submitStatus.error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitStatus.loading}
              className={`
                px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
                ${submitStatus.loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }
              `}
            >
              {submitStatus.loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UseTemplate;
