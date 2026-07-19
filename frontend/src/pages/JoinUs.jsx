import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services';
import SEO from '../components/SEO';
import AuthSubmitButton, { authFieldClass } from '../components/AuthSubmitButton';
import Waveform from '../components/Waveform';
import { departments, jobs } from '../data/jobs';
import { useAuth } from '../context/AppContext';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number is required'),
  linkedIn: z.string().url('Enter a valid LinkedIn URL').optional().or(z.literal('')),
  coverLetter: z.string().min(50, 'Tell us a bit more about yourself (min 50 characters)'),
  resume: z
    .any()
    .refine((files) => files?.length === 1, 'Resume is required')
    .refine((files) => ACCEPTED_RESUME_TYPES.includes(files?.[0]?.type), 'Upload a PDF or Word document')
    .refine((files) => files?.[0]?.size <= MAX_RESUME_SIZE, 'Resume must be 5 MB or smaller'),
});

const perks = [
  'Competitive salary & equity',
  'Premium Nimbus gear allowance',
  'Flexible hybrid & remote options',
  'Health, dental & vision coverage',
];

export default function JoinUs() {
  const { user } = useAuth();
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const filteredJobs = useMemo(
    () =>
      activeDepartment === 'All'
        ? jobs
        : jobs.filter((job) => job.department === activeDepartment),
    [activeDepartment]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const resumeField = register('resume');

  const selectJob = (jobId) => {
    setSelectedJobId(jobId);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmit = async (data) => {
    if (!user) return;
    if (!selectedJob) {
      toast.error('Please select a role to apply for');
      return;
    }

    setLoading(true);
    try {
      const file = data.resume[0];
      const resumeNote = `Resume: ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type})`;

      await contactService.send({
        name: data.name,
        email: data.email,
        subject: `Job Application — ${selectedJob.title}`,
        message: [
          `Position: ${selectedJob.title}`,
          `Department: ${selectedJob.department}`,
          `Location: ${selectedJob.location}`,
          `Phone: ${data.phone}`,
          `LinkedIn: ${data.linkedIn || 'Not provided'}`,
          resumeNote,
          '',
          'Cover letter:',
          data.coverLetter,
        ].join('\n'),
      });

      toast.success('Application submitted! Our recruiting team will be in touch.');
      reset();
      setSelectedJobId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = authFieldClass(
    !!user,
    'w-full rounded-lg border border-mist px-4 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20'
  );

  return (
    <>
      <SEO
        title="Join Us"
        description="Explore careers at Nimbus and apply to open roles in engineering, design, and more."
      />

      <section className="relative overflow-hidden bg-ink py-20 text-cloud sm:py-24">
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center opacity-40">
          <Waveform size="md" variant="default" className="max-w-md" label="" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-signal"
          >
            Careers at Nimbus
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Join us. Build what the world listens to next.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-cloud/70"
          >
            We&apos;re a team of engineers, designers, and storytellers obsessed with premium sound.
            Explore open roles and help shape the future of audio.
          </motion.p>
        </div>
      </section>

      <section className="border-b border-mist bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => setActiveDepartment(department)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeDepartment === department
                    ? 'bg-ink text-cloud'
                    : 'bg-mist/40 text-slate hover:bg-mist/70'
                }`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Open roles</h2>
              <p className="mt-1 text-sm text-slate">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
              </p>
            </div>
          </div>

          <div className="divide-y divide-mist rounded-2xl border border-mist bg-white">
            {filteredJobs.map((job, index) => (
              <motion.button
                key={job.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                onClick={() => selectJob(job.id)}
                className={`flex w-full flex-col gap-3 px-6 py-5 text-left transition-colors hover:bg-mist/20 sm:flex-row sm:items-center sm:justify-between ${
                  selectedJobId === job.id ? 'bg-signal/5' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{job.title}</h3>
                    {selectedJobId === job.id && (
                      <span className="rounded-full bg-signal/10 px-2.5 py-0.5 text-xs font-medium text-signal">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate">{job.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-signal">
                  Apply <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section ref={formRef} className="border-t border-mist bg-mist/25 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-semibold text-ink">Apply now</h2>
              <p className="mt-2 text-slate">
                {selectedJob
                  ? `Applying for ${selectedJob.title}. Complete the form and attach your resume.`
                  : 'Select a role above to begin your application.'}
              </p>

              <ul className="mt-8 space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-slate">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 rounded-2xl border border-mist bg-white p-8 shadow-sm lg:col-span-3"
            >
              <div className="rounded-xl border border-mist bg-mist/20 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate">Selected role</p>
                <p className="mt-1 font-medium text-ink">
                  {selectedJob ? selectedJob.title : 'No role selected yet'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
                    Full name
                  </label>
                  <input id="name" {...register('name')} className={inputClass} disabled={!user} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input id="email" type="email" {...register('email')} className={inputClass} disabled={!user} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">
                    Phone
                  </label>
                  <input id="phone" type="tel" {...register('phone')} className={inputClass} disabled={!user} />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <label htmlFor="linkedIn" className="mb-1 block text-sm font-medium text-ink">
                    LinkedIn <span className="text-slate">(optional)</span>
                  </label>
                  <input
                    id="linkedIn"
                    type="url"
                    placeholder="https://linkedin.com/in/you"
                    {...register('linkedIn')}
                    className={inputClass}
                    disabled={!user}
                  />
                  {errors.linkedIn && <p className="mt-1 text-sm text-red-500">{errors.linkedIn.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="coverLetter" className="mb-1 block text-sm font-medium text-ink">
                  Cover letter
                </label>
                <textarea
                  id="coverLetter"
                  rows={5}
                  placeholder="Why Nimbus? What would you bring to this role?"
                  {...register('coverLetter')}
                  className={inputClass}
                  disabled={!user}
                />
                {errors.coverLetter && (
                  <p className="mt-1 text-sm text-red-500">{errors.coverLetter.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="resume" className="mb-1 block text-sm font-medium text-ink">
                  Resume
                </label>
                <label
                  htmlFor="resume"
                  className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-mist bg-mist/10 px-4 py-8 text-center transition-colors ${
                    user ? 'cursor-pointer hover:border-signal/40 hover:bg-signal/5' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <Upload className="mb-2 h-5 w-5 text-slate" />
                  <span className="text-sm font-medium text-ink">Upload PDF or Word document</span>
                  <span className="mt-1 text-xs text-slate">Maximum file size: 5 MB</span>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    name={resumeField.name}
                    ref={resumeField.ref}
                    onBlur={resumeField.onBlur}
                    onChange={resumeField.onChange}
                    disabled={!user}
                  />
                </label>
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-500">{errors.resume.message?.toString()}</p>
                )}
              </div>

              <AuthSubmitButton loading={loading && !!user} disabled={!selectedJob}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </AuthSubmitButton>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
