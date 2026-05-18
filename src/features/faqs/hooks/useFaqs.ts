import { useState, useEffect, useCallback } from 'react';
import { FaqEntry } from '../types';
import { faqService } from '../services/faqService';
import { SEED_FAQS } from '../mock/faqData';

export const useFaqs = () => {
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      let storedFaqs = faqService.getFaqs();
      if (storedFaqs.length === 0) {
        faqService.saveFaqs(SEED_FAQS);
        storedFaqs = SEED_FAQS;
      }
      setFaqs(storedFaqs);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const addFaq = useCallback((faq: FaqEntry) => {
    faqService.addFaq(faq);
    setFaqs(prev => [...prev, faq]);
  }, []);

  const updateFaq = useCallback((updatedFaq: FaqEntry) => {
    faqService.updateFaq(updatedFaq);
    setFaqs(prev => prev.map(f => f.id === updatedFaq.id ? updatedFaq : f));
  }, []);

  const deleteFaq = useCallback((id: string) => {
    faqService.deleteFaq(id);
    setFaqs(prev => prev.filter(f => f.id !== id));
  }, []);

  const saveAllFaqs = useCallback((updatedFaqs: FaqEntry[]) => {
    faqService.saveFaqs(updatedFaqs);
    setFaqs(updatedFaqs);
  }, []);

  return {
    faqs,
    loading,
    addFaq,
    updateFaq,
    deleteFaq,
    saveAllFaqs
  };
};
