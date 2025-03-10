
import { useState } from 'react';
import { toast } from 'sonner';
import { Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SurveyQuestion {
  id: string;
  label: string;
  type: 'rating' | 'text' | 'textarea' | 'select' | 'multiselect';
  required?: boolean;
  options?: string[];
  conditional?: {
    field: string;
    value: string | number;
  };
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'satisfaction',
    label: 'How satisfied are you with your home buying experience?',
    type: 'rating',
    required: true
  },
  {
    id: 'buyerType',
    label: 'What type of buyer are you?',
    type: 'select',
    required: true,
    options: ['First-time buyer', 'Repeat buyer', 'Investment buyer']
  },
  {
    id: 'challenges',
    label: 'What challenges did you face during the home buying process?',
    type: 'multiselect',
    options: [
      'Finding the right property',
      'Securing financing',
      'Property inspection',
      'Negotiation',
      'Paperwork',
      'Other'
    ]
  },
  {
    id: 'otherChallenges',
    label: 'Please specify other challenges you faced',
    type: 'textarea',
    conditional: {
      field: 'challenges',
      value: 'Other'
    }
  },
  {
    id: 'improvements',
    label: 'What suggestions do you have for improving our service?',
    type: 'textarea'
  }
];

const SurveyForm = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (id: string, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Survey submitted:', formData);
      
      // Success message
      toast.success('Thank you for your feedback!', {
        description: 'Your responses will help improve our services.',
      });
      
      // Reset form
      setFormData({});
      
      // Reset any custom form states (like rating)
      const form = e.target as HTMLFormElement;
      form.reset();
      
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast.error('Something went wrong', {
        description: 'Please try submitting your feedback again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isQuestionVisible = (question: SurveyQuestion) => {
    if (!question.conditional) return true;
    
    const { field, value } = question.conditional;
    return formData[field]?.includes?.(value) || formData[field] === value;
  };
  
  return (
    <div className="glass rounded-xl p-6 transition-all duration-300">
      <h3 className="text-xl font-medium mb-6">New Home Buyer Survey</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {surveyQuestions.map((question) => (
          <div 
            key={question.id} 
            className={cn(
              "transition-all duration-300",
              isQuestionVisible(question) 
                ? "opacity-100 h-auto mb-5" 
                : "opacity-0 h-0 overflow-hidden m-0"
            )}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.type === 'rating' && (
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={cn(
                      "focus:outline-none transition-all",
                      formData[question.id] >= rating 
                        ? "text-yellow-400" 
                        : "text-gray-300 hover:text-yellow-200"
                    )}
                    onClick={() => handleChange(question.id, rating)}
                  >
                    <Star className={cn("w-8 h-8", formData[question.id] >= rating ? "fill-yellow-400" : "")} />
                  </button>
                ))}
              </div>
            )}
            
            {question.type === 'text' && (
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
              />
            )}
            
            {question.type === 'textarea' && (
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
              />
            )}
            
            {question.type === 'select' && (
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                value={formData[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
              >
                <option value="">Select an option</option>
                {question.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            
            {question.type === 'multiselect' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${question.id}-${option}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData[question.id]?.includes(option) || false}
                      onChange={(e) => {
                        const currentSelections = formData[question.id] || [];
                        const newSelections = e.target.checked
                          ? [...currentSelections, option]
                          : currentSelections.filter((item: string) => item !== option);
                        handleChange(question.id, newSelections);
                      }}
                    />
                    <label
                      htmlFor={`${question.id}-${option}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "flex items-center justify-center w-full px-6 py-3 rounded-md text-white font-medium transition-all",
            "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            isSubmitting && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              Submit Feedback
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
