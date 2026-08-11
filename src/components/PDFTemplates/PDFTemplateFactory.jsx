import ClassicTemplate from '../ResumeRenderers/ClassicTemplate';
import ModernTemplate from '../ResumeRenderers/ModernTemplate';

export const getPDFTemplate = (templateType) => {
  switch (templateType) {
    case 'modern':
      return ModernTemplate;
    case 'classic':
    default:
      return ClassicTemplate;
  }
};

export const availableTemplates = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'modern', name: 'Modern', component: ModernTemplate }
];