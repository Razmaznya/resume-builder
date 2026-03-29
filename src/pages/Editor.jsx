import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import html2pdf from 'html2pdf.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResumePreview from '../components/ResumePreview';
import './Editor.css';

const Editor = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewVisible, setPreviewVisible] = useState(true);

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      personal: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        address: '',
        summary: '',
      },
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ institution: '', degree: '', year: '', description: '' }],
      skills: [{ name: '' }],
      customSections: [],
    }
  });

  const { fields: expFields, append: addExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });
  const { fields: eduFields, append: addEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: skillFields, append: addSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });
  const { fields: customFields, append: addCustom, remove: removeCustom } = useFieldArray({ control, name: 'customSections' });

  useEffect(() => {
    if (resumeId && resumeId !== 'new') {
      const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const resume = resumes.find(r => r.id === resumeId);
      if (resume && resume.data) {
        Object.keys(resume.data).forEach(key => {
          setValue(key, resume.data[key]);
        });
        if (resume.template) setSelectedTemplate(resume.template);
      }
    }
  }, [resumeId, setValue]);

  const onSubmit = (data) => {
    const newResume = {
      id: resumeId === 'new' ? Date.now().toString() : resumeId,
      title: data.personal.fullName || 'Без названия',
      updatedAt: new Date().toISOString().split('T')[0],
      data,
      template: selectedTemplate,
    };
    const existing = JSON.parse(localStorage.getItem('resumes') || '[]');
    if (resumeId === 'new') {
      existing.push(newResume);
    } else {
      const index = existing.findIndex(r => r.id === resumeId);
      if (index !== -1) existing[index] = newResume;
      else existing.push(newResume);
    }
    localStorage.setItem('resumes', JSON.stringify(existing));
    navigate('/dashboard');
  };

  const handleExport = () => {
    const element = document.getElementById('resume-preview');
    if (element) {
      const opt = {
        margin: 0.5,
        filename: `${watch('personal.fullName') || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <>
      <Header />
      <div className="editor-container">
        <div className="container">
          <div className="editor-header">
            <h1>Редактор резюме</h1>
            <div className="editor-actions">
              <button onClick={() => setPreviewVisible(!previewVisible)} className="btn btn-outline">
                <i className="fas fa-eye"></i> {previewVisible ? 'Скрыть превью' : 'Показать превью'}
              </button>
              <button onClick={handleSubmit(onSubmit)} className="btn btn-primary">Сохранить</button>
              <button onClick={handleExport} className="btn btn-primary" style={{ background: 'var(--success)' }}>
                <i className="fas fa-file-pdf"></i> Экспорт PDF
              </button>
            </div>
          </div>

          <div className="editor-layout">
            <div className="editor-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Личная информация */}
                <section className="form-section">
                  <h2>Личная информация</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>ФИО *</label>
                      <input {...register('personal.fullName', { required: true })} />
                      {errors.personal?.fullName && <span className="error">Обязательное поле</span>}
                    </div>
                    <div className="form-group">
                      <label>Должность</label>
                      <input {...register('personal.title')} />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" {...register('personal.email', { required: true })} />
                      {errors.personal?.email && <span className="error">Обязательное поле</span>}
                    </div>
                    <div className="form-group">
                      <label>Телефон</label>
                      <input {...register('personal.phone')} />
                    </div>
                    <div className="form-group">
                      <label>Адрес</label>
                      <input {...register('personal.address')} />
                    </div>
                    <div className="form-group full-width">
                      <label>Краткое описание (о себе)</label>
                      <textarea rows="3" {...register('personal.summary')}></textarea>
                    </div>
                  </div>
                </section>

                {/* Опыт работы */}
                <section className="form-section">
                  <h2>Опыт работы</h2>
                  {expFields.map((field, index) => (
                    <div key={field.id} className="dynamic-field">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Компания</label>
                          <input {...register(`experience.${index}.company`)} />
                        </div>
                        <div className="form-group">
                          <label>Должность</label>
                          <input {...register(`experience.${index}.position`)} />
                        </div>
                        <div className="form-group">
                          <label>Дата начала</label>
                          <input type="month" {...register(`experience.${index}.startDate`)} />
                        </div>
                        <div className="form-group">
                          <label>Дата окончания</label>
                          <input type="month" {...register(`experience.${index}.endDate`)} />
                        </div>
                        <div className="form-group full-width">
                          <label>Описание обязанностей</label>
                          <textarea rows="3" {...register(`experience.${index}.description`)}></textarea>
                        </div>
                      </div>
                      {expFields.length > 1 && (
                        <button type="button" onClick={() => removeExp(index)} className="btn-remove">
                          <i className="fas fa-trash"></i> Удалить
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addExp({})} className="btn-add">
                    <i className="fas fa-plus"></i> Добавить опыт
                  </button>
                </section>

                {/* Образование */}
                <section className="form-section">
                  <h2>Образование</h2>
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="dynamic-field">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Учебное заведение</label>
                          <input {...register(`education.${index}.institution`)} />
                        </div>
                        <div className="form-group">
                          <label>Степень/Специальность</label>
                          <input {...register(`education.${index}.degree`)} />
                        </div>
                        <div className="form-group">
                          <label>Год окончания</label>
                          <input {...register(`education.${index}.year`)} />
                        </div>
                        <div className="form-group full-width">
                          <label>Описание</label>
                          <textarea rows="2" {...register(`education.${index}.description`)}></textarea>
                        </div>
                      </div>
                      {eduFields.length > 1 && (
                        <button type="button" onClick={() => removeEdu(index)} className="btn-remove">
                          <i className="fas fa-trash"></i> Удалить
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addEdu({})} className="btn-add">
                    <i className="fas fa-plus"></i> Добавить образование
                  </button>
                </section>

                {/* Навыки */}
                <section className="form-section">
                  <h2>Навыки</h2>
                  <div className="skills-list">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="skill-item">
                        <input {...register(`skills.${index}.name`)} placeholder="Навык" />
                        <button type="button" onClick={() => removeSkill(index)} className="btn-sm btn-danger">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addSkill({})} className="btn-add">
                    <i className="fas fa-plus"></i> Добавить навык
                  </button>
                </section>

                {/* Дополнительные разделы */}
                <section className="form-section">
                  <h2>Дополнительные разделы</h2>
                  {customFields.map((field, index) => (
                    <div key={field.id} className="dynamic-field">
                      <div className="form-group">
                        <label>Название раздела</label>
                        <input {...register(`customSections.${index}.title`)} />
                      </div>
                      <div className="form-group full-width">
                        <label>Содержание</label>
                        <textarea rows="3" {...register(`customSections.${index}.content`)}></textarea>
                      </div>
                      <button type="button" onClick={() => removeCustom(index)} className="btn-remove">
                        <i className="fas fa-trash"></i> Удалить
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addCustom({ title: '', content: '' })} className="btn-add">
                    <i className="fas fa-plus"></i> Добавить раздел
                  </button>
                </section>

                {/* Выбор шаблона */}
                <section className="form-section">
                  <h2>Выберите шаблон</h2>
                  <div className="template-options">
                    <div className={`template-option ${selectedTemplate === 'modern' ? 'active' : ''}`} onClick={() => setSelectedTemplate('modern')}>
                      <div className="template-preview modern"></div>
                      <span>Современный</span>
                    </div>
                    <div className={`template-option ${selectedTemplate === 'classic' ? 'active' : ''}`} onClick={() => setSelectedTemplate('classic')}>
                      <div className="template-preview classic"></div>
                      <span>Классический</span>
                    </div>
                    <div className={`template-option ${selectedTemplate === 'elegant' ? 'active' : ''}`} onClick={() => setSelectedTemplate('elegant')}>
                      <div className="template-preview elegant"></div>
                      <span>Элегантный</span>
                    </div>
                    <div className={`template-option ${selectedTemplate === 'minimal' ? 'active' : ''}`} onClick={() => setSelectedTemplate('minimal')}>
                      <div className="template-preview minimal"></div>
                      <span>Минималистичный</span>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {previewVisible && (
              <div className="editor-preview">
                <div id="resume-preview">
                  <ResumePreview data={watch()} template={selectedTemplate} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Editor;