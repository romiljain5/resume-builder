'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResumeFormData, resumeSchema } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ResumeFormProps {
  initialData: ResumeFormData;
  onSubmit: (data: ResumeFormData) => void;
  onChange?: (data: ResumeFormData) => void;
}

export function ResumeForm({ initialData, onSubmit, onChange }: ResumeFormProps) {
  // Create a stable reference for the form
  const [formKey] = useState(() => Date.now().toString());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
    setValue,
    getValues,
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      ...initialData,
      experience: initialData.experience?.length > 0 ? initialData.experience : [{
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      }],
      education: initialData.education?.length > 0 ? initialData.education : [{
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: '',
      }],
      skills: initialData.skills?.length > 0 ? initialData.skills : [''],
    },
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
    keyName: "_id"
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
    keyName: "_id",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills" as any,
    keyName: "_id", 
  });

  // Custom handler for adding skills to prevent re-renders
  const handleAddSkill = useCallback(() => {
    appendSkill("");
  }, [appendSkill]);

  // Custom handler for removing skills to prevent re-renders
  const handleRemoveSkill = useCallback((index: number) => {
    removeSkill(index);
  }, [removeSkill]);

  // Update form when initialData changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Watch form changes with debounce
  const formValues = watch();
  
  // Use a separate effect for the onChange handler with debounce
  useEffect(() => {
    if (!onChange) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      onChange(formValues);
    }, 500);
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formValues, onChange]);

  return (
    <form key={formKey} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input id="fullName" {...field} className="mt-1" />
          )}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input id="email" type="email" {...field} className="mt-1" />
          )}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input id="phone" {...field} className="mt-1" />
          )}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Optional)</label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Input id="location" {...field} className="mt-1" />
          )}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">Photo URL (Optional)</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Controller
              name="photoUrl"
              control={control}
              render={({ field }) => (
                <Input 
                  id="photoUrl"
                  {...field} 
                  className="mt-1" 
                  placeholder="https://example.com/your-photo.jpg" 
                />
              )}
            />
            {errors.photoUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.photoUrl.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter a URL to an image of yourself. The image should be square for best results.
            </p>
          </div>
          <div className="flex items-center justify-center">
            {formValues.photoUrl ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                <img 
                  src={formValues.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                    e.currentTarget.classList.add('error');
                  }}
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Photo
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Professional Summary</label>
        <Controller
          name="summary"
          control={control}
          render={({ field }) => (
            <Textarea id="summary" {...field} className="mt-1" rows={4} />
          )}
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Experience</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendExperience({
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              description: '',
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
        <div className="space-y-4">
          {experienceFields.map((field, index) => (
            <div key={field._id} className="border p-4 rounded-lg space-y-4 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700">Company</label>
                <Controller
                  name={`experience.${index}.company`}
                  control={control}
                  render={({ field }) => (
                    <Input id={`company-${index}`} {...field} className="mt-1" />
                  )}
                />
                {errors.experience?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.company?.message}</p>
                )}
              </div>
              <div>
                <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700">Position</label>
                <Controller
                  name={`experience.${index}.position`}
                  control={control}
                  render={({ field }) => (
                    <Input id={`position-${index}`} {...field} className="mt-1" />
                  )}
                />
                {errors.experience?.[index]?.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.position?.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`exp-start-date-${index}`} className="block text-sm font-medium text-gray-700">Start Date</label>
                  <Controller
                    name={`experience.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <Input id={`exp-start-date-${index}`} {...field} className="mt-1" placeholder="e.g., Jan 2020" />
                    )}
                  />
                  {errors.experience?.[index]?.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.startDate?.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`exp-end-date-${index}`} className="block text-sm font-medium text-gray-700">End Date</label>
                  <Controller
                    name={`experience.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <Input id={`exp-end-date-${index}`} {...field} className="mt-1" placeholder="e.g., Present" />
                    )}
                  />
                  {errors.experience?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.endDate?.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor={`exp-description-${index}`} className="block text-sm font-medium text-gray-700">Description</label>
                <Controller
                  name={`experience.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea id={`exp-description-${index}`} {...field} className="mt-1" rows={3} />
                  )}
                />
                {errors.experience?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.description?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendEducation({
              institution: '',
              degree: '',
              startDate: '',
              endDate: '',
              description: '',
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
        <div className="space-y-4">
          {educationFields.map((field, index) => (
            <div key={field._id} className="border p-4 rounded-lg space-y-4 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Education {index + 1}</h3>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700">Institution</label>
                <Controller
                  name={`education.${index}.institution`}
                  control={control}
                  render={({ field }) => (
                    <Input id={`institution-${index}`} {...field} className="mt-1" />
                  )}
                />
                {errors.education?.[index]?.institution && (
                  <p className="mt-1 text-sm text-red-600">{errors.education[index]?.institution?.message}</p>
                )}
              </div>
              <div>
                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700">Degree</label>
                <Controller
                  name={`education.${index}.degree`}
                  control={control}
                  render={({ field }) => (
                    <Input id={`degree-${index}`} {...field} className="mt-1" />
                  )}
                />
                {errors.education?.[index]?.degree && (
                  <p className="mt-1 text-sm text-red-600">{errors.education[index]?.degree?.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`edu-start-date-${index}`} className="block text-sm font-medium text-gray-700">Start Date</label>
                  <Controller
                    name={`education.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <Input id={`edu-start-date-${index}`} {...field} className="mt-1" placeholder="e.g., Sep 2016" />
                    )}
                  />
                  {errors.education?.[index]?.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.education[index]?.startDate?.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`edu-end-date-${index}`} className="block text-sm font-medium text-gray-700">End Date</label>
                  <Controller
                    name={`education.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <Input id={`edu-end-date-${index}`} {...field} className="mt-1" placeholder="e.g., May 2020" />
                    )}
                  />
                  {errors.education?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.education[index]?.endDate?.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor={`edu-description-${index}`} className="block text-sm font-medium text-gray-700">Description</label>
                <Controller
                  name={`education.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea id={`edu-description-${index}`} {...field} className="mt-1" rows={2} />
                  )}
                />
                {errors.education?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.education[index]?.description?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSkill}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
        <div className="space-y-4">
          {skillFields.map((field, index) => (
            <div key={`skill-${field._id}`} className="flex items-center gap-2">
              <Controller
                key={`skill-controller-${field._id}`}
                name={`skills.${index}`}
                control={control}
                render={({ field: inputField }) => (
                  <>
                    <label htmlFor={`skill-${index}`} className="sr-only">Skill {index + 1}</label>
                    <Input 
                      id={`skill-${index}`}
                      {...inputField} 
                      className="flex-grow"
                      placeholder="e.g., JavaScript, Project Management, etc."
                    />
                  </>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSkill(index)}
                className="text-red-500 hover:text-red-700"
                disabled={skillFields.length <= 1}
                aria-label={`Remove skill ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Resume
      </Button>
    </form>
  );
}