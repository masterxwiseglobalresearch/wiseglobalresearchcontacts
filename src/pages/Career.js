// src/pages/Career.js
import React, { useEffect, useMemo, useState } from 'react';
import { Trans } from '../i18nShim';
import { motion } from 'framer-motion';
import careersImg from '../assets/images/careers.png';
import { FaBriefcase, FaUpload } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { ref as dbRef, push, set, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { toast } from 'react-toastify';

// Unified animation variants (consistent with Evaluation-style pages)
const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// Jobs will be loaded dynamically from RTDB /jobs where active === true

const careerImage = careersImg;
const fallbackImage = careersImg;

const Career = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    whyHire: '',
    jobId: '',
  });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('No file chosen');
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [jobs, setJobs] = useState({});

  useEffect(() => {
    // Load only active jobs
    const q = query(dbRef(db, 'jobs'), orderByChild('active'), equalTo(true));
    const off = onValue(q, (snap) => {
      setJobs(snap.val() || {});
    });
    return () => off();
  }, []);

  const jobList = useMemo(() => Object.entries(jobs).map(([id, j]) => ({ id, ...j })), [jobs]);

  // If there are no active jobs, default to a general application bucket
  useEffect(() => {
    if (jobList.length === 0 && formData.jobId !== 'general') {
      setFormData((prev) => ({ ...prev, jobId: 'general' }));
    }
  }, [jobList.length, formData.jobId]);

  // If active jobs exist, default to the first one when nothing is selected
  useEffect(() => {
    if (jobList.length > 0 && !formData.jobId) {
      setFormData((prev) => ({ ...prev, jobId: jobList[0].id }));
    }
  }, [jobList, formData.jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: 'File size must be less than 5MB' });
        setFileName('No file chosen');
        setFormData({ ...formData, resume: null });
      } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors({ ...errors, resume: 'Only PDF or Word files are allowed' });
        setFileName('No file chosen');
        setFormData({ ...formData, resume: null });
      } else {
        setErrors({ ...errors, resume: '' });
        setFileName(file.name);
        setFormData({ ...formData, resume: file });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.resume) newErrors.resume = 'Resume is required';
  if (!formData.whyHire.trim()) newErrors.whyHire = 'This field is required';
  // Require a job selection only when there are active jobs listed; otherwise default to 'general'
  if (jobList.length > 0 && !formData.jobId) newErrors.jobId = 'Please select a job';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (honeypot) {
      return;
    }
    setLoading(true);
    try {
      // Read resume as Base64 and store entirely in RTDB
      let resumeData = '';
      let resumeMeta = null;
      if (formData.resume) {
        resumeMeta = {
          name: formData.resume.name,
          size: formData.resume.size,
          contentType: formData.resume.type || 'application/octet-stream',
        };
        resumeData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const result = reader.result; // data:*/*;base64,....
              const base64 = typeof result === 'string' ? result.split(',')[1] : '';
              resolve(base64 || '');
            } catch (e) { reject(e); }
          };
          reader.onerror = reject;
          reader.readAsDataURL(formData.resume);
        });
      }

  // Save submission to RTDB under jobApplications for clarity
  const node = push(dbRef(db, 'jobApplications'));
      await set(node, {
        source: 'career',
        jobId: String(formData.jobId || ''),
        name: String(formData.name || ''),
        email: String(formData.email || ''),
        phone: String(formData.phone || ''),
        whyHire: String(formData.whyHire || ''),
        resumeMeta,
        resumeData, // base64 content
        timestamp: Date.now(),
        honeypot: '',
      });

      // Also POST to server /send-email so HR receives an email (server will forward to career email)
      try {
        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('mobile', formData.phone);
        form.append('city', '');
        form.append('interest', formData.jobId || 'career');
        form.append('message', formData.whyHire || '');
        form.append('source', 'Career');
        if (formData.resume) form.append('resume', formData.resume, formData.resume.name);

              // Use relative endpoint during development only when appropriate
              const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
              const port = (typeof window !== 'undefined' && window.location.port) ? window.location.port : '';
              const useRelative = (process.env.REACT_APP_USE_LOCAL_SEND_EMAIL === 'true') || (isLocalhost && port === '3001');
              const backendUrl = useRelative ? '/send-email' : 'https://wise-globle-research-2.onrender.com/send-email';
  let resp = null;
          try {
            resp = await fetch(backendUrl, { method: 'POST', body: form });
          } catch (fetchErr) {
            console.warn('FormData POST to /send-email failed, will try base64 fallback', fetchErr);
          }
          // If FormData POST failed or returned non-ok, try JSON base64 fallback
          if (!resp || !resp.ok) {
            try {
              // read resume as base64 (if present)
              let resumeBase64 = null;
              let resumeName = null;
              let resumeType = null;
              if (formData.resume) {
                const toBase64 = (file) => new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(String(reader.result).split(',')[1]);
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                try {
                  resumeBase64 = await toBase64(formData.resume);
                  resumeName = formData.resume.name;
                  resumeType = formData.resume.type || 'application/pdf';
                } catch (e) {
                  console.warn('Failed to convert resume to base64 for fallback', e);
                }
              }
              const jsonBody = {
                name: formData.name,
                email: formData.email,
                mobile: formData.phone,
                city: '',
                interest: formData.jobId || 'career',
                message: formData.whyHire || '',
                source: 'Career',
                resumeBase64,
                resumeName,
                resumeType
              };
              resp = await fetch(backendUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonBody) });
            } catch (fallbackErr) {
              console.warn('Base64 fallback to /send-email failed', fallbackErr);
            }
          }
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          console.warn('Server /send-email failed', err);
          toast.warn('Application saved but email notification failed');
        } else {
          toast.info('We have emailed your application to HR');
        }
      } catch (mailErr) {
        console.warn('Failed to POST to /send-email', mailErr);
        toast.warn('Application saved but email notification failed');
      }

      toast.success('Application submitted successfully!', { position: 'top-center' });
  setFormData({ name: '', email: '', phone: '', resume: null, whyHire: '', jobId: '' });
      setFileName('No file chosen');
      setErrors({});
      try{
        if (window.analyticsPush) {
          window.analyticsPush('career_application', { jobId: formData.jobId || 'general' });
        }
      }catch(e){}
    } catch (err) {
      const msg = err?.message || String(err);
      toast.error(`Failed to submit application: ${msg}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <motion.section
      className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Helmet>
        <title>Careers at Wise Global Research</title>
        <meta name="description" content="Join Wise Global Research — open roles, internships and application process for researchers and developers." />
        <link rel="canonical" href="https://wiseglobalresearch.com/career" />
      </Helmet>
      {/* Page container */}
      <motion.div className="container mx-auto max-w-5xl card-text" variants={staggerContainer}>
        {/* Header Section */}
        <motion.h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-center heading-purple" variants={fadeIn}>
          <Trans i18nKey="pages.Career.career-opportunities">Career Opportunities</Trans>
        </motion.h1>
        <motion.p className="text-lg text-center mb-8" variants={fadeIn}>
          <Trans i18nKey="pages.Career.join">Join</Trans>
          <span className="font-semibold"> <Trans i18nKey="pages.Career.wise-global-research">Wise Global Research</Trans> </span>
          <Trans i18nKey="pages.Career.and-build-a-rewarding-career-in-india-s-">
            <Trans i18nKey="pages.Career.and-build-a-rewarding-career-in-india-s--1">and build a rewarding career in India’s financial markets.</Trans>
          </Trans>
        </motion.p>

        {/* Introduction Section */}
        <motion.div className="rounded-xl p-6 sm:p-8 mb-10 card-box" variants={fadeIn}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 heading-purple">
            <Trans i18nKey="pages.Career.wise-global-research-as-a-career">
              <Trans i18nKey="pages.Career.wise-global-research-as-a-career-1">Wise Global Research as a Career</Trans>
            </Trans>
          </h2>
          <p className="text-base sm:text-lg leading-7 mb-4">
            <Trans i18nKey="pages.Career.wise-global-research-is-not-just-a-resea">
              <Trans i18nKey="pages.Career.wise-global-research-is-not-just-a-resea-1">
                Wise Global Research is not just a Research Analyst company but a vibrant place to grow your career in finance. We value innovation, professionalism, and teamwork, and we’re committed to providing our employees with the resources to succeed.
              </Trans>
            </Trans>
          </p>
          <img
            src={careerImage}
            alt="Wise Global Research Career"
            className="w-full h-56 sm:h-64 object-cover rounded-lg mt-3"
            onError={handleImageError}
          />
        </motion.div>

        {/* Current Openings Section (dynamic) */}
        <motion.div className="mb-10" variants={staggerContainer}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center heading-purple">
            <Trans i18nKey="pages.Career.current-openings">Current Openings</Trans>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobList.map((job) => (
              <motion.div
                key={job.id}
                className="rounded-xl p-6 card-box"
                variants={fadeIn}
              >
                <FaBriefcase className="text-3xl mb-3 heading-purple" />
                <h3 className="text-lg sm:text-xl font-semibold mb-1 heading-purple">{job.title}</h3>
                <p className="mb-1">{job.location}</p>
                <p className="mb-3">{job.description}</p>
                <h4 className="text-base sm:text-lg font-semibold mb-2 heading-purple">
                  <Trans i18nKey="pages.Career.requirements">Requirements:</Trans>
                </h4>
                <ul className="list-disc pl-6 space-y-1">
                  {Array.isArray(job.requirements)
                    ? job.requirements.map((req, index) => (<li key={index}>{req}</li>))
                    : String(job.requirements || '')
                        .split(/\r?\n|,/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s, i) => (<li key={i}>{s}</li>))}
                </ul>
              </motion.div>
            ))}
            {jobList.length === 0 && (
              <div className="text-center col-span-1 md:col-span-2 opacity-80">No openings currently.</div>
            )}
          </div>
        </motion.div>

        {/* Application Form Section */}
        <motion.div className="rounded-xl p-6 sm:p-8 mb-10 card-box" variants={fadeIn}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center heading-purple">
            <Trans i18nKey="pages.Career.apply-now">Apply Now</Trans>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
          {/* Select Job */}
            <div>
              <label htmlFor="jobId" className="block font-semibold mb-2 heading-purple">Select Job</label>
            <select
              id="jobId"
              name="jobId"
              value={formData.jobId}
              onChange={(e)=>setFormData({...formData, jobId: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
            >
              <option value="">-- Choose an opening --</option>
              <option value="general">General Application</option>
              {jobList.map(j => (
                <option key={j.id} value={j.id}>{j.title} — {j.location}</option>
              ))}
            </select>
            {errors.jobId && <p className="text-red-400 text-sm mt-1">{errors.jobId}</p>}
          </div>
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex="-1"
            autoComplete="off"
            className="hidden"
          />
          <div>
            <label htmlFor="name" className="block font-semibold mb-2 heading-purple"><Trans i18nKey="pages.Career.your-name">Your Name</Trans></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block font-semibold mb-2 heading-purple"><Trans i18nKey="pages.Career.your-email">Your Email</Trans></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block font-semibold mb-2 heading-purple"><Trans i18nKey="pages.Career.phone-number">Phone Number</Trans></label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="resume" className="block font-semibold mb-2 heading-purple"><Trans i18nKey="pages.Career.upload-your-resume">Upload Your Resume</Trans></label>
            <div className="flex items-center">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume" className="flex items-center btn-purple cursor-pointer">
                <FaUpload className="mr-2" />
                <Trans i18nKey="pages.Career.choose-file">Choose File</Trans>
              </label>
              <span className="ml-4">{fileName}</span>
            </div>
            {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
          </div>
          <div>
            <label htmlFor="whyHire" className="block font-semibold mb-2 heading-purple"><Trans i18nKey="pages.Career.why-should-we-hire-you">Why Should We Hire You?</Trans></label>
            <textarea
              id="whyHire"
              name="whyHire"
              value={formData.whyHire}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
              rows="5"
              placeholder="Tell us why you’re the right fit for Wise Global Research"
            />
            {errors.whyHire && <p className="text-red-400 text-sm mt-1">{errors.whyHire}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'btn-purple'}`}
          >
            {loading ? 'Submitting...' : (<Trans i18nKey="pages.Career.submit-application">Submit Application</Trans>)}
          </button>
          </form>
        </motion.div>

        {/* Call to Action */}
        <motion.div className="text-center rounded-xl p-6 sm:p-8 mb-10 card-box" variants={fadeIn}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 heading-purple">
            <Trans i18nKey="pages.Career.join-our-team">Join Our Team</Trans>
          </h2>
          <p className="max-w-2xl mx-auto mb-5">
            <Trans i18nKey="pages.Career.ready-to-make-an-impact-in-india-s-finan">
              <Trans i18nKey="pages.Career.ready-to-make-an-impact-in-india-s-finan-1">
                Ready to make an impact in India’s financial markets? Contact our HR team to learn more about career opportunities at Wise Global Research.
              </Trans>
            </Trans>
          </p>
          <a href="/contact" className="inline-block btn-purple px-6 py-3 font-semibold rounded-lg">
            <Trans i18nKey="pages.Career.contact-us">Enquiry</Trans>
          </a>
        </motion.div>

      </motion.div>
    </motion.section>
  );
};

export default Career;