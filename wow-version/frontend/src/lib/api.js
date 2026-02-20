import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const parsePDF = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/parse-pdf', form)
}
export const analyzeJD = (jd) => api.post('/analyze-jd', { job_description: jd })
export const generateQuestions = (resume, analysis) => api.post('/generate-questions', { resume_text: resume, jd_analysis: analysis })
export const optimizeResume = (resume, analysis, answers) => api.post('/optimize', { resume_text: resume, jd_analysis: analysis, answers })
export const saveResume = (data) => api.post('/save-resume', data)
export const setAPIKey = (key) => api.post('/set-key', { api_key: key })
export const getResumes = () => api.get('/resumes')
export const getHistory = () => api.get('/history')
export const getHealth = () => api.get('/health')
export default api
