// src/hooks/useSearchProducts.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const useSearchProducts = (query: string) => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setSearchLoading(true);
      setSearchError(null);

      try {
        const response = await axios.get(`http://192.168.1.2:3333/products`, {
          params: {
            search: query,
          },
        });
        setProducts(response.data);
      } catch (err) {
        setSearchError('Erro ao buscar produtos. Tente novamente.');
      } finally {
        setSearchLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return {
    products,
    searchLoading,
    searchError,
  };
};

export default useSearchProducts;
