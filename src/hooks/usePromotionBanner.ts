// src/hooks/usePromotionBanner.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePromotionBanner = () => {
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get('http://192.168.1.2:3333/banner'); // Atualize com a URL correta
        setBanner(response.data);
      } catch (err) {
        setError('Failed to fetch banner');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  return { banner, loading, error };
};

export default usePromotionBanner;
