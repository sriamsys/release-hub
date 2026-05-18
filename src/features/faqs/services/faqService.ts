import { createBaseService } from '@/services/baseService';
import { FaqEntry } from '../types';

const STORAGE_KEY = 'faqs_data';
const base = createBaseService<FaqEntry>(STORAGE_KEY);

export const faqService = {
  getFaqs: base.getAll,
  saveFaqs: base.saveAll,
  addFaq: base.add,
  updateFaq: base.update,
  deleteFaq: base.delete
};
